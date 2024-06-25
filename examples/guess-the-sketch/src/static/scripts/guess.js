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

// socket.on('guess_sketch_response', (data) => {
//   document.querySelector('body').classList.remove('loading')
//   loaderContainer.classList.add('hidden')
//   loaderContainer.classList.remove('loader-container--prompt')
//   exitBtn.classList.remove('hidden')
//   pageHeroPlayer.classList.remove('hidden')
//   guesses.classList.remove('hidden')

//   document.getElementById('opponentId').textContent = data.opponentId;
//   document.getElementById('round').textContent = data.round;
//   const formId = 'guess' + data.round;
//   const guessesImgDiv = document.getElementById(formId).querySelector('.guesses__img');
//   const guessImage = guessesImgDiv.querySelector('img');
//   guessesImgDiv.style.width = 'auto';  // Example - adjust as needed
//   guessesImgDiv.style.height = 'auto';  // Optionally maintain aspect ratio
//   guessesImgDiv.style.margin = '0 auto';  // Center the image
//   guessImage.src = 'data:image/jpeg;base64,' + data.image;

//   // polulate the prompt image for opponent
//   const promptDivId = 'opponentPlayerPrompt' + data.round;
//   const promptImgDivId = 'opponentPlayerPromptImg' + data.round;
//   const promptDiv = document.getElementById(promptDivId);
//   const promptImgDiv = document.getElementById(promptImgDivId);

//   promptDiv.textContent = data.prompt;
//   promptImgDiv.style.width = 'auto';  // Example - adjust as needed
//   promptImgDiv.style.height = 'auto';  // Optionally maintain aspect ratio
//   promptImgDiv.style.margin = '0 auto';  // Center the image
//   promptImgDiv.src = 'data:image/jpeg;base64,' + data.image;
//   if (data.round === 3) {
//     document.getElementById('getAllOpponentPrompts').value = 'true';
//   }
// });

// socket.on('prompt_response', (data) => {
//   const promptForm = document.getElementById('caption' + data.round);
//   const limitedPrompts = document.getElementById('limitedPrompts').textContent;
//   if (limitedPrompts === 'false') {
//     if (data.image === "") {
//       // Failed to generate image, show error message and re-enable form input
//       const inputField = promptForm.querySelector('input[type="text"]')
//       const submitBtn = promptForm.querySelector('button[type="submit"]')
//       const captionNote = promptForm.querySelector('.prompts__caption-note')
  
//       promptForm.removeAttribute('disabled')
//       inputField.removeAttribute('disabled')
//       submitBtn.removeAttribute('disabled')
//       captionNote?.classList.remove('hidden')
  
//       // Set error state
//       setErrorState(promptForm.closest('.prompts__caption'))
//     } else {
//       // First handle the prompt form state transfer
//       promptForm.classList.add('submitted');
//       const nextEl = promptForm.nextElementSibling  
//       // If next for is not submitted, remove disable
//       if (nextEl !== null && !nextEl.classList.contains('submitted')) {
//         enableNextPrompt(nextEl)
//       } else {
//         setLoadingStatePrompt('Waiting for other players to finish...')
//       }
  
//       // Then store the prompt image
//       const promptDivId = 'currentPlayerPrompt' + data.round;
//       const promptImgDivId = 'currentPlayerPromptImg' + data.round;
//       const promptDiv = document.getElementById(promptDivId);
//       const promptImgDiv = document.getElementById(promptImgDivId);
  
//       promptDiv.textContent = data.prompt;
//       promptImgDiv.style.width = 'auto';  // Example - adjust as needed
//       promptImgDiv.style.height = 'auto';  // Optionally maintain aspect ratio
//       promptImgDiv.style.margin = '0 auto';  // Center the image
//       promptImgDiv.src = 'data:image/jpeg;base64,' + data.image;
//       if (data.round === 3) {
//         document.getElementById('getAllMyPrompts').value = 'true';
//       }
//     }
//   } else {
//       // Then store the prompt image
//       const promptDivId = 'currentPlayerPrompt' + data.round;
//       const promptImgDivId = 'currentPlayerPromptImg' + data.round;
//       const promptDiv = document.getElementById(promptDivId);
//       const promptImgDiv = document.getElementById(promptImgDivId);
  
//       promptDiv.textContent = data.prompt;
//       promptImgDiv.style.width = 'auto';  // Example - adjust as needed
//       promptImgDiv.style.height = 'auto';  // Optionally maintain aspect ratio
//       promptImgDiv.style.margin = '0 auto';  // Center the image
//       promptImgDiv.src = 'data:image/jpeg;base64,' + data.image;
//       if (data.round === 3) {
//         document.getElementById('getAllMyPrompts').value = 'true';
//       }
//   }
// });

// socket.on('guess_response', (data) => {
//   const currentPlayerGuessImgDivId = 'currentPlayerGuessImg' + data.round;
//   const opponentPlayerGuessImgDivId = 'opponnentPlayerGuessImg' + data.round;
//   const currentPlayerGuessParagraphDivId = 'currentPlayerGuess' + data.round;
//   const opponentPlayerGuessParagraphDivId = 'opponnentPlayerGuess' + data.round;

//   let guessImgDiv;
//   let guessParagraphDiv;
//   if (data.from === 'myself') {
//     guessImgDiv = document.getElementById(currentPlayerGuessImgDivId);
//     guessParagraphDiv = document.getElementById(currentPlayerGuessParagraphDivId);
//     if (data.round === 3) {
//       document.getElementById('getAllMyGuesses').value = 'true';
//     }
//   } else {
//     guessImgDiv = document.getElementById(opponentPlayerGuessImgDivId);
//     guessParagraphDiv = document.getElementById(opponentPlayerGuessParagraphDivId);
//     if (data.round === 3) {
//       document.getElementById('getAllOpponentGuesses').value = 'true';
//     }
//   }

//   guessParagraphDiv.textContent = data.guess;
//   guessImgDiv.style.margin = '0 auto';  // Center the image
//   const limitedPrompts = document.getElementById('limitedPrompts').textContent;
//   if (limitedPrompts === 'true') {
//     guessImgDiv.style.width = '450px';  // Example - adjust as needed
//     guessImgDiv.style.height = '200px';  // Optionally maintain aspect ratio
//     guessImgDiv.src = '/static/imgs/logo.svg';
//   } else {
//     guessImgDiv.style.width = 'auto';  // Example - adjust as needed
//     guessImgDiv.style.height = 'auto';  // Optionally maintain aspect ratio
//     guessImgDiv.src = 'data:image/jpeg;base64,' + data.image;
//   }
// });

// socket.on('guess_image_generation_response', (data) => {
//   const guessFormId = 'guess' + data.round;
//   const guessForm = document.getElementById(guessFormId);
//   const guessInputForm = document.getElementById('guesses__input' + data.round);
//   if (data.response === "failure") {
//     // Set error state
//     setErrorState(guessInputForm.closest('.guesses__input'))
//     // Enable the form to allow re-submission
//     enableGuess(guessForm)
//   } else {
//     guessForm.classList.add('hidden');
//     const nextEl = guessForm.nextElementSibling
//     if (nextEl !== null && nextEl.classList.contains('hidden')) {
//       nextEl.classList.remove('hidden')
//     } else {
//       // set loading state
//       setLoadingStateGuesses('Calculating results and waiting for other player ...')
      
//       // Wait for all images and scores to be populated on result page
//       let intervalId = setInterval(checkDivValue, 200)
//       function checkDivValue() {
//         const getAllMyPrompts = document.getElementById('getAllMyPrompts').value;
//         const getAllMyGuesses = document.getElementById('getAllMyGuesses').value;
//         const getAllMyScores = document.getElementById('getAllMyScores').value;
//         const getAllOpponentPrompts = document.getElementById('getAllOpponentPrompts').value;
//         const getAllOpponentGuesses = document.getElementById('getAllOpponentGuesses').value;
//         const getAllOpponentScores = document.getElementById('getAllOpponentScores').value;
//         const myTotalScore = document.getElementById('myTotalScore').textContent;
//         const opponentTotalScore = document.getElementById('opponentTotalScore').textContent;
      
//         if (getAllMyPrompts === 'true' && getAllMyGuesses === 'true' && getAllMyScores === 'true' && getAllOpponentPrompts === 'true' && getAllOpponentGuesses === 'true' && getAllOpponentScores === 'true' && myTotalScore !== null && opponentTotalScore !== null) {
//           if (parseFloat(myTotalScore) > parseFloat(opponentTotalScore)) {
//             document.getElementById('currentPlayerResultsText').textContent = 'You won!';
//           } else if (parseFloat(myTotalScore) < parseFloat(opponentTotalScore)) {
//             document.getElementById('currentPlayerResultsText').textContent = 'You lost!';
//           } else {
//             document.getElementById('currentPlayerResultsText').textContent = 'It\'s a tie!';
//           }

//           document.querySelector('body').classList.remove('loading')
//           document.querySelector('body').classList.add('has-results')
//           loaderContainer.classList.add('hidden')
//           loaderContainer.classList.remove('loader-container--guesses')
//           exitBtn.classList.remove('hidden')
//           pageHeroPlayer.classList.remove('hidden')
//           pageHeroPlayer.style.transition = 'none'
//           results.classList.remove('hidden')

//           clearInterval(intervalId)
//         }
//       }
//     }
//   }
// });

// socket.on('score_response', (data) => {
//   const currentPlayerGuessPercentageDivId = 'currentPlayerGuessPercentage' + data.round;
//   const opponentPlayerGuessPercentageDivId = 'opponnentPlayerGuessPercentage' + data.round;

//   let guessPercentDiv;
//   if (data.from === 'myself') {
//     guessPercentDiv = document.getElementById(currentPlayerGuessPercentageDivId);
//   } else {
//     guessPercentDiv = document.getElementById(opponentPlayerGuessPercentageDivId);
//   }

//   const constPerctage = Math.round(data.score * 100);
//   guessPercentDiv.textContent = constPerctage + "%";

//   if (data.from === 'myself') {
//     if (data.round === 3) {
//       document.getElementById('getAllMyScores').value = 'true';
//       let myTotalScore = 0.0;
//       for (let i = 1; i <= 3; i++) {
//         const currentPlayerGuessPercentageDivId = 'currentPlayerGuessPercentage' + i;
//         const currentScoreString = document.getElementById(currentPlayerGuessPercentageDivId).textContent.slice(0, -1);
//         const currentScore = parseFloat(currentScoreString);
//         myTotalScore += currentScore;
//       }
//       document.getElementById('myTotalScore').textContent = myTotalScore;
//     }
//   } else {
//     if (data.round === 3) {
//       document.getElementById('getAllOpponentScores').value = 'true';
//       let opponentTotalScore = 0.0;
//       for (let i = 1; i <= 3; i++) {
//         const opponnentPlayerGuessPercentageDivId = 'opponnentPlayerGuessPercentage' + i;
//         const currentScoreString = document.getElementById(opponnentPlayerGuessPercentageDivId).textContent.slice(0, -1);
//         const currentScore = parseFloat(currentScoreString);
//         opponentTotalScore += currentScore;
//       }
//       document.getElementById('opponentTotalScore').textContent = opponentTotalScore;
//     }
//   }
// });

// init
$(document).ready(function() {
  enableGuess($("#guess1"));
});
