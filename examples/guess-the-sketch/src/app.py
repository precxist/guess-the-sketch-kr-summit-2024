# Copyright 2024 Google LLC All Rights Reserved.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http:#www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

from flask import Flask, render_template, request, jsonify
from json import loads
import time
import logging  # Import the logging module
import random
import requests
import json
import base64
import shutil
import os
import vertexai
import urllib
import numpy as np
from flask import send_file
from vertexai.preview.vision_models import ImageGenerationModel
from vertexai.language_models import TextEmbeddingInput, TextEmbeddingModel
from PIL import Image

PROJECT_ID = "minjkang-default"  # @param {type:"string"}
LOCATION = "asia-southeast1"  # @param {type:"string"}
vertexai.init(project=PROJECT_ID, location=LOCATION)

DB_DIR = "/tmp/db"
MATCH_DICT = {'1': 2, '2': 1}

app = Flask(__name__,
            static_folder="static")
app.config['SECRET_KEY'] = f'{int(random.random()*100000000)}'

logging.basicConfig(level=logging.DEBUG)  # Set to logging.INFO for less verbose logs
logger = logging.getLogger(__name__)  # Get a logger for your application

headers = {"Content-Type": "application/json"}

logger.debug('gameserver started')

# GET index
@app.route('/')
def index():
    player_id = request.args.get('playerId')
    player_dir = os.path.join(DB_DIR, f"p{player_id}")
    shutil.rmtree(player_dir, ignore_errors=True)

    return render_template('index.html')

# POST join
@app.route('/join')
def join():
    player_id = request.args.get('playerId')
    player_dir = os.path.join(DB_DIR, f"p{player_id}")
    os.makedirs(player_dir, exist_ok=True)
    return jsonify(status="success")

# POST is-opponent-joined
@app.route('/is-opponent-joined')
def is_opponent_joined():
    ready_players = os.listdir(DB_DIR)
    if len(ready_players) == 2:
        ready = True
    else:
        ready = False

    return jsonify(ready=ready)

# GET play
@app.route('/play')
def play():
    player_id = request.args.get('playerId')
    return render_template('play.html', playerId=player_id)

# POST send-prompt
@app.route('/send-prompt')
def send_prompt():
    player_id = request.args.get('playerId')
    prompt = request.args.get('prompt')
    index = request.args.get('index')

    player_dir = os.path.join(DB_DIR, f"p{player_id}")
    os.makedirs(player_dir, exist_ok=True)

    # save image
    local_path = os.path.join(player_dir, f"{index}.png")
    
    # temp
    url = "https://i1.sndcdn.com/avatars-000389897325-h3s225-t500x500.jpg"
    image = Image.open(requests.get(url, stream=True).raw)
    image = image.resize((800, 800))
    image.save(local_path)

    # generate embedding and save prompt as json file
    model = TextEmbeddingModel.from_pretrained("text-embedding-005")
    inputs = [TextEmbeddingInput(prompt, "SEMANTIC_SIMILARITY")]
    embedding = model.get_embeddings(inputs)[0].values
    json_dict = {
        "prompt": prompt,
        "embedding": embedding
    }

    jsonf_path = os.path.join(player_dir, f"answer{index}.json")

    with open(jsonf_path, 'w', encoding='UTF-8') as f:
        json.dump(json_dict, f, ensure_ascii=False)

    return jsonify(result="success")

# POST is-opponent-done-generation
@app.route('/done-generation')
def is_opponent_done_generation():
    cnt = 0

    for player_id in [1, 2]:
        player_dir = os.path.join(DB_DIR, f"p{player_id}")
        cnt += len(os.listdir(player_dir))

    if cnt == 12:
        done = True
    else:
        done = False

    return jsonify(done=done)

# GET guess
@app.route('/guess')
def guess():
    player_id = request.args.get('playerId')
    opponent_id = MATCH_DICT[player_id]

    return render_template('guess.html', playerId=player_id, opponentId=opponent_id)


@app.route('/sketch')
def sketch():
    player_id = request.args.get('playerId')
    index = request.args.get('index')
    file_path = os.path.join(DB_DIR, f"p{player_id}", f"{index}.png")

    return send_file(file_path, mimetype='image/png')

@app.route('/submit-guess')
def submit_guess():
    player_id = request.args.get('playerId')
    opponent_id = MATCH_DICT[player_id]
    guess1 = request.args.get('guess1')
    guess2 = request.args.get('guess2')
    guess3 = request.args.get('guess3')
    guesses = [guess1, guess2, guess3]

    player_dir = os.path.join(DB_DIR, f"p{player_id}")
    os.makedirs(player_dir, exist_ok=True)

    opponent_dir = os.path.join(DB_DIR, f"p{opponent_id}")
    os.makedirs(opponent_dir, exist_ok=True)

    # generate embedding and save prompt as json file
    model = TextEmbeddingModel.from_pretrained("text-embedding-005")
    inputs = [TextEmbeddingInput(guess, "SEMANTIC_SIMILARITY") for guess in guesses]
    embeddings = model.get_embeddings(inputs)

    for index in range(3):
        guess_dict = {
            "guess": guesses[index],
            "embedding": embeddings[index].values
        }

        answer_jsonf_path = os.path.join(opponent_dir, f"answer{index+1}.json")
        with open(answer_jsonf_path, 'r', encoding='UTF-8') as f:
            answer_dict = json.load(f)
        
        answer_embedding = answer_dict["embedding"]
        guess_embedding = guess_dict["embedding"]
        score = np.dot(answer_embedding, guess_embedding) / (np.linalg.norm(answer_embedding) * np.linalg.norm(guess_embedding))
        score = np.rint(score * 100)

        guess_dict["score"] = score
        guess_jsonf_path = os.path.join(opponent_dir, f"guess{index+1}.json")

        with open(guess_jsonf_path, 'w', encoding='UTF-8') as f:
            json.dump(guess_dict, f, ensure_ascii=False)

    return jsonify(result="success")

LIMITED_PROMPTS = os.environ.get("LIMITED_PROMPTS", "false")
logger.debug('LIMITED_PROMPTS: %s', LIMITED_PROMPTS)

@app.route('/result')
def result():
    current_player = request.args.get('playerId')
    opponent_id = MATCH_DICT[current_player]

    return render_template(
        'result.html', 
        current_player=current_player, 
        opponent_id=opponent_id
    )

# POST is-opponent-joined
@app.route('/is-result-ready')
def is_result_ready():
    current_player = request.args.get('playerId')
    players = ['1', '2']
    guess_cnt = 0

    for player_id in players:
        player_dir = os.path.join(DB_DIR, f"p{player_id}")
        guess_cnt += len([fname for fname in os.listdir(player_dir) if "guess" in fname])

    if guess_cnt == 6:
        ready = True

        result_dict = {}

        for player_id in players:
            result_dict[player_id] = {}
            player_dict = result_dict[player_id]
        
            for idx in range(3):
                row = {}
                player_dir = os.path.join(DB_DIR, f"p{player_id}")

                answer_json_path = os.path.join(player_dir, f"answer{idx+1}.json")
                with open(answer_json_path, 'r', encoding='UTF-8') as f:
                    answer = json.load(f)
                row["prompt"] = answer["prompt"]
                row["sketch"] = f"/sketch?playerId={player_id}&index={idx+1}"
                
                guess_json_path = os.path.join(player_dir, f"guess{idx+1}.json")
                with open(guess_json_path, 'r', encoding='UTF-8') as f:
                    guess = json.load(f)
                row["guess"] = guess["guess"]
                row["score"] = guess["score"]
                player_dict[str(idx+1)] = row

        opponent_id = str(MATCH_DICT[current_player])
        current_player_result = result_dict[current_player]
        opponent_result = result_dict[opponent_id]

        return jsonify(
            ready=ready, 
            current_player=current_player,
            current_player_result=current_player_result, 
            opponent_id=opponent_id,
            opponent_result=opponent_result
        )
    else:
        ready = False
        return jsonify(ready=ready)

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=80)
