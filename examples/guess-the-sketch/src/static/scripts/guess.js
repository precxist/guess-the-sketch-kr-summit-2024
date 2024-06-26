// global
const pageHero = document?.querySelector('.hero')
const pageHeroPlayer = pageHero.querySelector('.player-tag')
const exitBtn = document?.getElementById('exitGame')
const loaderContainer = document?.querySelector('.loader-container')

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
  const inputField = form?.querySelector('input[type="text"]')
  const submitBtn = form.querySelector('button[type="submit"]')
  const captionNote = form.querySelector('.prompts__caption-note')

  // set disable states
  form.setAttribute('disabled', '')
  inputField.setAttribute('disabled', '')
  inputField.parentNode.classList.remove('active')
  submitBtn.setAttribute('disabled', '')
  captionNote.classList.add('hidden')

  // if value, set to input
  if (value) {
    inputField.value = value
  }
}

const disableGuess = (guessForm) => {
  const inputField = guessForm.find('input[type="text"]')
  const submitBtn = guessForm.find('button[type="submit"]')
  const captionNote = guessForm.find('.guesses__note')
  const keyboardBtn = guessForm.find('#keyboard')

  inputField.attr('disabled', '')
  submitBtn.attr('disabled', '')
  keyboardBtn.attr('hidden', '')
  captionNote?.addClass('hidden')
}

const enableGuess = (guessForm) => {
  const inputField = guessForm.find('input[type="text"]')
  const submitBtn = guessForm.find('button[type="submit"]')
  const captionNote = guessForm.find('.guesses__note')
  const keyboardBtn = guessForm.find('#keyboard')

  inputField.removeAttr('disabled')
  submitBtn.removeAttr('disabled')
  keyboardBtn.removeAttr('hidden')
  captionNote.removeClass('hidden')
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

// set loading state for when guesses are completed
const setLoadingStateGuesses = (text) => {
  // set loading state
  document.querySelector('body').classList.add('loading')
  guesses.classList.add('hidden')
  exitBtn.classList.add('hidden')
  pageHeroPlayer.classList.add('hidden')
  loaderContainer.querySelector('p').innerHTML = text
  loaderContainer.classList.add('loader-container--guesses')
  loaderContainer.classList.remove('hidden')
  window.scrollTo({ top: 0, behavior: 'smooth' })
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

// set state for guess 1
const setGuessState1 = (promptsEntered, guessesEntered) => {
  const form = guessesForms[0]
  const nextEl = guessesForms[0].nextElementSibling
  // hide prompts
  hideAllPrompts(promptsEntered)
  guesses.classList.remove('hidden')
  form.classList.add('hidden')
  form.querySelector('input[type="text"]').value = guessesEntered[0]
  nextEl.classList.remove('hidden')
}

const setGuessState2 = (promptsEntered, guessesEntered) => {
  const form1 = guessesForms[0]
  const form2 = guessesForms[1]
  const nextEl = guessesForms[1].nextElementSibling
  // hide prompts
  hideAllPrompts(promptsEntered)
  // show guesses container
  guesses.classList.remove('hidden')
  // hide forms
  form1.classList.add('hidden')
  form1.querySelector('input[type="text"]').value = guessesEntered[0]
  form2.classList.add('hidden')
  form2.querySelector('input[type="text"]').value = guessesEntered[1]
  // show next
  nextEl.classList.remove('hidden')
}

const setGuessState3 = (promptsEntered, guessesEntered) => {
  const form1 = guessesForms[0]
  const form2 = guessesForms[1]
  const form3 = guessesForms[2]
  // hide prompts
  hideAllPrompts(promptsEntered)
  // show guesses container
  guesses.classList.remove('hidden')
  // hide forms
  form1.classList.add('hidden')
  form1.querySelector('input[type="text"]').value = guessesEntered[0]
  form2.classList.add('hidden')
  form2.querySelector('input[type="text"]').value = guessesEntered[1]
  form3.classList.add('hidden')
  form3.querySelector('input[type="text"]').value = guessesEntered[2]
  // set loading state
  setLoadingStateGuesses('Calculating results...')
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
// if (playAgainBtn) {
//   playAgainBtn.addEventListener('click', (e) => {
//     e.preventDefault()
//     // Socket message
//     socket.emit('playAgain', 'true') 
//     window.location.href = "http://" + frontendURL;
//   })
// }

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

    // form submit event
    $(form).find("button").click(function(){
      form = $(form)
      const guess = form.find('input[type="text"]').val();
      index = Number(form.attr('id').match(/\d+/)[0]);
      $("input[type=hidden]#guess" + index).val(guess);
      form.addClass('hidden');
      
      const opponentId = form.find(".guesses__img > img").attr("src").match(/\d+/)[0]

      if (index < 3){
        index += 1
        const nextForm = $("form#guess" + index);
        nextForm.find(".guesses__img > img").attr("src", `/sketch?playerId=${opponentId}&index=${index}`)
        nextForm.removeClass('hidden');
      }
      else{
        setLoadingStateGuesses('점수를 계산중입니다...');

        $.ajax({
          url: "/submit-guess",
          cache: false,
          data:{
            playerId: playerId,
            guess1: $("input[type=hidden]#guess1").val(),
            guess2: $("input[type=hidden]#guess2").val(),
            guess3: $("input[type=hidden]#guess3").val(),
          },
          success: function(data){
            location.href = "/result?playerId=" + playerId;
          }
        });
      }

    })
  })
}

// init
$(document).ready(function() {
  $(window).keydown(function(event){
    if(event.keyCode == 13) {
      event.preventDefault();
      return false;
    }
  });

  enableGuess($("#guess1"));
});
