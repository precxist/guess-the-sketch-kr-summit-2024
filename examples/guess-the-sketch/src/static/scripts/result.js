// global
const pageHero = document?.querySelector('.hero')
const pageHeroPlayer = pageHero.querySelector('.player-tag')
const exitBtn = document?.getElementById('exitGame')
const loaderContainer = document?.querySelector('.loader-container')
const playAgainBtn = document?.getElementById('playAgain')

// get playerId
const searchParams = new URLSearchParams(window.location.search)
const playerId = searchParams.get('playerId')

// If Exit button exists, run click event
if (exitBtn) {
    exitBtn.addEventListener('click', (e) => {
      e.preventDefault();
      let searchParams = new URLSearchParams(window.location.search);
      let playerId = searchParams.get('playerId');
      window.location.href = './?playerId=' + playerId;
    })
}

const setLoadingStatePrompt = (text) => {
    // Set loading state
    document.querySelector('body').classList.add('loading')
    exitBtn.classList.add('hidden')
    pageHeroPlayer.classList.add('hidden')
    loaderContainer.classList.add('loader-container--prompt')
    loaderContainer.querySelector('p').innerHTML = text
    loaderContainer.classList.remove('hidden')
    window.scrollTo({ top: 0, behavior: 'smooth' })
}

const unsetLoadingStatePrompt = () => {
    // Set loading state
    document.querySelector('body').classList.remove('loading')
    exitBtn.classList.remove('hidden')
    pageHeroPlayer.classList.remove('hidden')
    loaderContainer.classList.remove('loader-container--prompt')
    loaderContainer.classList.add('hidden')
}

// If Play Again button exists, run click event
if (playAgainBtn) {
    playAgainBtn.addEventListener('click', (e) => {
      e.preventDefault();
        window.location.href = './?playerId=' + playerId;
    })
}

$(document).ready(function() {
    setLoadingStatePrompt('Calculating scores...');

    // poll for the other player to join
    setInterval(function () {
        $.ajax({
          url: "/is-result-ready",
          cache: false,
          data:{playerId: playerId},
          success: function(data){
            if (data.ready){
                $("body").addClass("has-results");
                const currentPlayerResult = data.current_player_result;
                const opponentResult = data.opponent_result;

                const currentPlayer = data.current_player;
                const opponentId = data.opponent_id;

                $("span#currentPlayer").text("Player " + currentPlayer);
                $("span#opponentPlayer").text("Player " + opponentId);

                var currentPlayerScore = 0;
                var opponentPlayerScore = 0;

                for (let i=1; i<=3; i++) {
                    $("p#opponentPlayerPrompt" + i).text(opponentResult[i].prompt);
                    $("img#opponentPlayerPromptImg" + i).attr("src", opponentResult[i].sketch);
                    $("p#currentPlayerGuess" + i).text(opponentResult[i].guess);
                    $("span#currentPlayerScore" + i).text(opponentResult[i].score + "%");
                    currentPlayerScore += opponentResult[i].score;

                    $("p#currentPlayerPrompt" + i).text(currentPlayerResult[i].prompt);
                    $("img#currentPlayerPromptImg" + i).attr("src", currentPlayerResult[i].sketch);
                    $("p#opponentPlayerGuess" + i).text(currentPlayerResult[i].guess);
                    $("span#opponentPlayerScore" + i).text(currentPlayerResult[i].score + "%");
                    opponentPlayerScore += currentPlayerResult[i].score;
                }

                if (currentPlayerScore > opponentPlayerScore){
                    // $("p#currentPlayerResultsText").text("You Won!");
                    $("p#currentPlayerResultsText").text("You win!");
                }
                else if(currentPlayerScore == opponentPlayerScore){
                    // $("p#currentPlayerResultsText").text("It's a Tie!");
                    $("p#currentPlayerResultsText").text("Draw!");
                }
                else{
                    // $("p#currentPlayerResultsText").text("You Lost!");
                    $("p#currentPlayerResultsText").text("You lose!");
                }
                $("span#currentPlayerScore").text(Math.round(currentPlayerScore/3));
                $("span#opponentPlayerScore").text(Math.round(opponentPlayerScore/3));
                
                $("div.results").removeClass("hidden");
                unsetLoadingStatePrompt();
            }
          }
        });
    }, 1000);
    // enableGuess($("#guess1"));
});
  