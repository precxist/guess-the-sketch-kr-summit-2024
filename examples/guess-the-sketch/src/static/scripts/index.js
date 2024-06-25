// global
const exitBtn = document?.getElementById('exitGame')
const startGameBtn = document?.getElementById('startGame')
const loaderContainer = document?.querySelector('.loader-container')

// get playerId
const searchParams = new URLSearchParams(window.location.search)
const playerId = searchParams.get('playerId')

// If Start Game btn exists, run click event
if(startGameBtn) {
  startGameBtn.addEventListener('click', (e) => {
    e.preventDefault();
    setLoadingStateIndex('상대방을 기다리는 중입니다...')

    $.ajax({
      url: "/join",
      data:{playerId: playerId},
      cache: false,
      success: function(data){
        // do nothing
      }
    });

    // poll for the other player to join
    setInterval(function () {
      $.ajax({
        url: "/is-opponent-joined",
        cache: false,
        success: function(data){
          if (data.ready){
            location.href = "/play?playerId=" + playerId;
          }
        }
      });
    }, 1000);
    
  })
}

// If Exit button exists, run click event
if(exitBtn) {
  exitBtn.addEventListener('click', (e) => {
    e.preventDefault();
    let searchParams = new URLSearchParams(window.location.search);
    let playerId = searchParams.get('playerId');
    window.location.href = './?playerId=' + playerId;
  })
}

const setLoadingStateIndex = (text) => {
  const container = document.querySelector('.intro')
  const content = container.querySelector('.intro__content')
  const loader = container.querySelector('.loader')
  const steps = document.querySelector('.intro__steps')

  $(loader).find("p").text(text);

  // Set loading state
  container.classList.add('loading')
  content.classList.add('hidden')
  loader.classList.remove('hidden')
  steps.classList.add('hidden')
}
