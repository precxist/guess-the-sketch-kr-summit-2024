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
from vertexai.preview.vision_models import ImageGenerationModel
from vertexai.language_models import TextEmbeddingInput, TextEmbeddingModel


PROJECT_ID = "minjkang-default"  # @param {type:"string"}
LOCATION = "asia-northeast3"  # @param {type:"string"}
vertexai.init(project=PROJECT_ID, location=LOCATION)

DB_DIR = "/tmp/db"

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
    os.makedirs(player_dir)
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

    # imagen = ImageGenerationModel.from_pretrained("imagegeneration@006")
    # response = imagen.generate_images(
    #     prompt=prompt,
    #     number_of_images=1,
    #     safety_filter_level="block_some",
    # )
    # print(type(response.images[0]))

    player_dir = os.path.join(DB_DIR, f"p{player_id}")
    time.sleep(5)

    # dummy - save image
    local_path = os.path.join(player_dir, f"{index}.png")
    print(player_dir)
    urllib.request.urlretrieve("https://cloud.google.com/static/vertex-ai/generative-ai/docs/image/images/sample_generate-image-from-text_bulldog.png", local_path)

    # generate embedding and save prompt as json file

    model = TextEmbeddingModel.from_pretrained("text-multilingual-embedding-002")
    inputs = [TextEmbeddingInput(prompt, "SEMANTIC_SIMILARITY")]
    embedding = model.get_embeddings(inputs)[0].values
    json_dict = {
        "prompt": prompt,
        "embedding": embedding
    }

    jsonf_path = os.path.join(player_dir, f"{index}.json")

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
    return render_template('guess.html', playerId=player_id)


LIMITED_PROMPTS = os.environ.get("LIMITED_PROMPTS", "false")
logger.debug('LIMITED_PROMPTS: %s', LIMITED_PROMPTS)

# game_round = 3
# embedding_endpoint = 'http://embeddings-api'
# # The nested dictionary to store the prompts and pictures for each round of each player
# # The outer dictionary is indexed by the player id, and the inner dictionary is indexed by the round number
# player_prompt = {}
# # The nested dictionary to store the guesses and pictures for each round of each player
# # The outer dictionary is indexed by the player id, and the inner dictionary is indexed by the round number
# player_guess = {}
# # The set to store the players who have clicked the "New Game" button or disconnected for more than 30 seconds
# dropped_players = set()
# # The set to store the players who was assigned to the gameserver
# connected_players = set()
# # The set to store the players who is/was connected
# player_history = set()
# sid_to_player_id = {}
# player_id_to_promptes_set = {}
# full_connection_time = time.time()

# # When player submit the guess
# @socketio.on('guess')
# def handle_message(data):
#     player_id = sid_to_player_id[request.sid]
#     message = data['message']
#     oppontent_id = data['opponentId']
#     round = int(data['round'])

#     logger.debug('Player %s: Received guess %s for opponent %s: %s', player_id, str(round), oppontent_id, message)
#     encoded_image = "placeholder"
#     if LIMITED_PROMPTS == "true":
#         pass
#     else:
#         # Do moderation by generating the image from the guess
#         guess_payload = {
#             'prompt': f'''{message}''',
#         }
#         model_response = requests.post(IMAGE_GENERATION_ENDPOINT, headers=headers, json=guess_payload)
#         if model_response.content == b'{}':
#             emit('guess_image_generation_response', {'response': 'failure', 'round': round}, room=player_id)
#             return
#         encoded_image = base64.b64encode(model_response.content).decode('utf-8')

#     emit('guess_image_generation_response', {'response': 'success', 'round': round}, room=player_id)
#     # Store the guess
#     if player_guess.get(player_id) is None:
#         player_guess[player_id] = {}
#     player_guess[player_id][round] = {
#         'guess': message
#     }

#     player_guess[player_id][round]['guess_picture'] = encoded_image
#     # Send the guess picture to both the players, they will be shown in summary page
#     emit('guess_response', {'image': encoded_image, 'guess': message, 'round': round, 'from': 'myself'}, room=player_id)
#     emit('guess_response', {'image': encoded_image, 'guess': message, 'round': round, 'from': 'other'}, room=oppontent_id)

#     # Send next picture which is generated by the opponent's prompt
#     if round != game_round:
#         next_round = round + 1
#         while player_prompt[oppontent_id][next_round]['picture'] is None:
#             time.sleep(0.1)
#         emit('guess_sketch_response', {'image': player_prompt[oppontent_id][next_round]['picture'], 'prompt': player_prompt[oppontent_id][next_round]['prompt'], 'opponentId': oppontent_id, 'round': next_round}, room=player_id)
#         logger.debug('Player %s: Sent image %s', player_id, str(next_round))
    
#     # Generate the similarity score and send to both players; they will be shown in summary page
#     try:
#         score = similarity(player_prompt[oppontent_id][round]['prompt'], player_guess[player_id][round]['guess'])
#     except:
#         logging.exception("similarity() failed")
#         score = -0.99   # "-99%" still fits in the text box, but it's obviously a weird number.
#     player_prompt[player_id][round]['guess_score'] = score

#     # Send the score to both the players,
#     emit('score_response', {'score': score, 'round': round, 'from': 'myself'}, room=player_id)
#     emit('score_response', {'score': score, 'round': round, 'from': 'other'}, room=oppontent_id)

# # When player submit the prompt for generating Sketch
# @socketio.on('prompt')
# def handle_message(data):
#     player_id = sid_to_player_id[request.sid]
#     message = data['message']
#     round = int(data['round'])
#     logger.debug('Player %s: Received prompt %s: %s', player_id, str(round), message)

#     # Generate and store the picture for the prompt\
#     picture_generate_payload = {
#         'prompt': f'''{message}''',
#     }
#     model_response = requests.post(IMAGE_GENERATION_ENDPOINT, headers=headers, json=picture_generate_payload)
#     # Send an empty image to indicate the picture generation failure
#     error_handling = not LIMITED_PROMPTS
#     if model_response.content == b'{}':
#         emit('prompt_response', {'image': '', 'prompt': message, 'round': round, 'error_handling': error_handling}, room=player_id)
#         return
#     encoded_image = base64.b64encode(model_response.content).decode('utf-8')
#     # Store the prompt and generated picture
#     if player_prompt.get(player_id) is None:
#         player_prompt[player_id] = {}
#     player_prompt[player_id][round] = {
#         'prompt': message
#     }
#     player_prompt[player_id][round]['picture'] = encoded_image

#     # Send the generated picture back to the player, this will be shown in the summary page
#     emit('prompt_response', {'image': encoded_image, 'prompt': message, 'round': round, 'error_handling': error_handling}, room=player_id)
    
#     # Now check whether it's time to send the picture to the opponent for guessing
#     # The first picture should be displayed if both players have entered all their prompts
#     # The first picture page should be displayed only if the picture is generated
#     if round != game_round:
#         return
#     logger.debug('Player %s: All prompts received', player_id)
#     while len(player_prompt) != 2:
#         time.sleep(0.1)
#     for player in player_prompt:
#         if player != player_id:
#             while len(player_prompt[player]) != game_round:
#                 time.sleep(0.1)
#             while 'picture' not in player_prompt[player][1]:
#                 time.sleep(0.1)
#             # Send the first picture to the opponent for guessing
#             emit('guess_sketch_response', {'image': player_prompt[player][1]['picture'], 'prompt': player_prompt[player][1]['prompt'], 'opponentId': player, 'round': 1}, room=player_id)

# def similarity(p1, p2):
#     '''Calculate dot product distance between two prompts'''

#     resp = requests.post(
#         url = EMBEDDINGS_ENDPOINT,
#         headers = {"Content-Type": "application/json"},
#         json = {'prompts': [p1, p2], 'model': EMBEDDINGS_MODEL},
#         timeout=1,
#     )
#     resp.raise_for_status()

#     embeddings = loads(resp.text)['embeddings']
#     return dot(embeddings[0], embeddings[1])

# def dot(v1, v2):
#    return sum(i[0] * i[1] for i in zip(v1, v2))

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=7654)
