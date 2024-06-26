// global
const pageHero = document?.querySelector('.hero')
const pageHeroPlayer = pageHero.querySelector('.player-tag')
const exitBtn = document?.getElementById('exitGame')
const startGameBtn = document?.getElementById('startGame')
const loaderContainer = document?.querySelector('.loader-container')
// prompts vars
const prompts = document?.getElementById('prompts')
const promptsPreCompiled = document?.getElementById('promptsPreCompiled')
const promptsForms = prompts?.querySelectorAll('form')
// guesses vars
const guesses = document?.getElementById('guesses')
const guessesForms = guesses?.querySelectorAll('form')
const guessesHeader = guesses?.querySelector('.guesses__header')
// results vars
const results = document?.getElementById('results')
const playAgainBtn = document?.getElementById('playAgain')

// get playerId
const searchParams = new URLSearchParams(window.location.search)
const playerId = searchParams.get('playerId')

// disable prompt form, set classes and attributes
const disablePrompt = (form, value) => {
  const inputField = form.find('input[type="text"]')
  const submitBtn = form.find('button[type="submit"]')
  const captionNote = form.find('.prompts__caption-note')

  // set disable states
  form.attr('disabled', '')
  inputField.attr('disabled', '')
  inputField.parent().addClass('active')
  submitBtn.attr('disabled', '')
  captionNote.addClass('hidden');

  // if value, set to input
  if (value) {
    inputField.value = value
  }
}

const disableGuess = (guessFrom, value) => {
  const inputField = guessFrom.querySelector('input[type="text"]')
  const submitBtn = guessFrom.querySelector('button[type="submit"]')
  const captionNote = guessFrom.querySelector('.guesses__note')
  const keyboardBtn = guessFrom.querySelector('#keyboard')

  inputField.setAttribute('disabled', '')
  submitBtn.setAttribute('disabled', '')
  keyboardBtn.setAttribute('hidden', '')
  captionNote?.classList.add('hidden')

  if (value) {
    inputField.value = value
  }
}

const enableGuess = (guessFrom) => {
  const inputField = guessFrom.querySelector('input[type="text"]')
  const submitBtn = guessFrom.querySelector('button[type="submit"]')
  const captionNote = guessFrom.querySelector('.guesses__note')
  const keyboardBtn = guessFrom.querySelector('#keyboard')

  inputField.removeAttribute('disabled')
  submitBtn.removeAttribute('disabled')
  keyboardBtn.removeAttribute('hidden')
  captionNote?.classList.remove('hidden')
}

// enable next prompt form, set classes and attributes
const enableNextPrompt = (nextEl) => {
  const nextInputField = nextEl.querySelector('input[type="text"]')
  const nextSubmitBtn = nextEl.querySelector('button[type="submit"]')
  const nextCaptionNote = nextEl.querySelector('.prompts__caption-note')
  // Remove disable attributes
  nextEl.removeAttribute('disabled')
  nextInputField?.removeAttribute('disabled')
  nextCaptionNote?.classList.remove('hidden')
}

// look for radio value and check it
const checkRadioValue = (form, value) => {
  form.querySelectorAll('input[type="radio"]').forEach((radio) => {
    if (radio.value == value) {
      radio.setAttribute('checked', '')
    } else {
      radio.removeAttribute('checked')
    }
  })
}

// set loading state for prompt when completed
const setLoadingStatePrompt = (text) => {
  // Set loading state
  document.querySelector('body').classList.add('loading')
  prompts?.classList.add('hidden')
  promptsPreCompiled?.classList.add('hidden')
  exitBtn.classList.add('hidden')
  pageHeroPlayer.classList.add('hidden')
  loaderContainer.classList.add('loader-container--prompt')
  loaderContainer.querySelector('p').innerHTML = text
  loaderContainer.classList.remove('hidden')
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const hideAllPrompts = (values) => {
  prompts?.classList.add('hidden')
  if (promptsForms?.length > 0) {
    promptsForms.forEach((prompt, index) => {
      prompt.setAttribute('disabled', '')
      prompt.querySelector('input[type="text"]').setAttribute('disabled', '')
      prompt.querySelector('input[type="text"]').value = values[index]
      prompt.querySelector('button[type="submit"]').setAttribute('disabled', '')
      prompt.querySelector('.prompts__caption-note').classList.add('hidden')
    })
  }
}

const hideAllGuesses = (values) => {
  guesses?.classList.add('hidden')
  if (guessesForms?.length > 0) {
    guessesForms.forEach((guess, index) => {
      guess.classList.add('hidden')
      guess.value = values[index]
    })
  }
}


const setResultsState = (promptsEntered, guessesEntered) => {
  // hide prompts
  hideAllPrompts(promptsEntered)
  // hide guesses
  hideAllGuesses(guessesEntered)
  // show results
  document.querySelector('body').classList.remove('guesses-submitted')
  document.querySelector('body').classList.add('has-results')
  loaderContainer.classList.add('hidden')
  pageHero.classList.remove('hidden')
  results.classList.remove('hidden')
}

// set Error state based on input id
const setErrorState = (inputForm) => {
  inputForm.classList.add('error')
  inputForm.querySelector('.error-message').classList.remove('hidden')
  inputForm.querySelector('button[type="submit"]').setAttribute('disabled', '')
}

// If Exit button exists, run click event
if (exitBtn) {
  exitBtn.addEventListener('click', (e) => {
    e.preventDefault();
    let searchParams = new URLSearchParams(window.location.search);
    let playerId = searchParams.get('playerId');
    window.location.href = './?playerId=' + playerId;
  })
}

// If Play Again button exists, run click event
if (playAgainBtn) {
  playAgainBtn.addEventListener('click', (e) => {
    e.preventDefault()
    // Socket message
    socket.emit('playAgain', 'true') 
    window.location.href = "http://" + frontendURL;
  })
}

// Prompts submit events
// If prompts form exists, run submit event for each
if (promptsForms?.length > 0) {
  promptsForms.forEach((form, index) => {
    const keyboardBtn = form.querySelector('#keyboard')
    const button = form?.querySelector('.prompts__caption-submit button')
    const input = form?.querySelector('.prompts__caption-input input[type="text"]')

    // text input control
    input.addEventListener('input', (e) => {
      if (e.target.value.length > 0) {
        input.parentNode.classList.add('active')
        if (input.closest('.prompts__caption').classList.contains('error')) {
          input.closest('.prompts__caption').classList.remove('error')
          input
            .closest('.prompts__caption')
            .querySelector('.error-message')
            .classList.add('hidden')
        }
        button.removeAttribute('disabled')
      } else {
        input.parentNode.classList.remove('active')
        button.setAttribute('disabled', '')
      }
    })

    // Submit event on each caption
    form = $(form);
    form.find("button").click(function(){
      const prompt = form.find('input[type="text"]').val();

      $.ajax({
        url: "/send-prompt",
        cache: false,
        data:{
          playerId: playerId,
          prompt: prompt,
          index: index + 1
        },
        beforeSend: function() {
          disablePrompt(form);
          // get value
          $("#minjkang-loader").find("p").text("이미지 생성중...");
          $("#minjkang-loader").removeClass('hidden');
        },
        complete: function() {
          $("#generation-done").after('<img id="generatedImg" src="" class="mBox"/>');
          $("#generatedImg").attr("src", `/sketch?playerId=${playerId}&index=${index + 1}`);
          $("#generatedImg").attr("title", `${prompt}`);
          $('.mBox').mBox();
          $("#generatedImg").trigger( "click" );

          $( "#generatedImg" ).remove();

          // hide loader
          $("#minjkang-loader").addClass('hidden');
          if (index < 2){
            const currentForm = $('#caption' + (index+1));
            currentForm.addClass('submitted');

            index += 1;
            const nextForm = $('#caption' + (index+1));
            nextForm.find('input[type="text"]').removeAttr('disabled');
            nextForm.find('.prompts__caption-note').removeClass('hidden');
          }
      
          else{
            $("#generation-done").val("y");
            $(".mBox-close").bind('click', function() { 
              $('#generation-done').trigger("change");
            });
          }
        },
      });
    });
  })
}

$("#generation-done").change(function(){
  if ($("#generation-done").val() == 'y'){
    setLoadingStatePrompt('상대방을 기다리는 중입니다...')

    setInterval(function () {
      $.ajax({
        url: "/done-generation",
        cache: false,
        success: function(data){
          if (data.done){
            location.href = "/guess?playerId=" + playerId;
          }
        }
      });
    }, 1000);
  }
});

// If guesses form exists, run submit event for each
if (guessesForms?.length > 0) {
  guessesForms.forEach((form, index) => {
    const input = form?.querySelector('.guesses__input input[type="text"]')
    const button = form?.querySelector('.guesses__submit button')
    const keyboardBtn = form?.querySelector('#keyboard')

    // Keyboard icon click, bring up keyboard
    if (keyboardBtn) {
      keyboardBtn?.addEventListener('click', (e) => {
        // focus and click to trigger keyboard
        e.target.nextElementSibling.focus()
        e.target.nextElementSibling.click()
      })
    }

    // text input control
    input.addEventListener('input', (e) => {
      if(e.target.value.length > 0) {
        button.removeAttribute('disabled')
        input.parentNode.classList.add('active')
        if (input.closest('.guesses__input').classList.contains('error')) {
          input.closest('.guesses__input').classList.remove('error')
          input
            .closest('.guesses__input')
            .querySelector('.error-message')
            .classList.add('hidden')
        }
      } else {
        button.setAttribute('disabled', '')
        input.parentNode.classList.remove('active')
      }
    })

  })
}

// init
$(document).ready(function() {
  prompts.classList.remove('hidden');

  $(window).keydown(function(event){
    if(event.keyCode == 13) {
      // console.log();
      event.preventDefault();
      return false;
    }
  });
});
