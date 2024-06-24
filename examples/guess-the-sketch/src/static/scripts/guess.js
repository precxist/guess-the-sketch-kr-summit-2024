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
const promptsPreCompiledForms = promptsPreCompiled.querySelectorAll('form')
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

// set state for prompt 1
const setPromptState1 = (values) => {
  // if free form prompt
  if (promptsForms?.length > 0) {
    const prompt1 = promptsForms[0]
    const inputField = prompt1.querySelector('input[type="text"]')
    const submitBtn = prompt1.querySelector('button[type="submit"]')
    const captionNote = prompt1.querySelector('.prompts__caption-note')
    const nextEl = prompt1.nextElementSibling

    // add first state
    disablePrompt(prompt1, values[0])
    // enable next state
    enableNextPrompt(nextEl)
  }

  // if pre-compiled prompts
  if (promptsPreCompiledForms.length > 0) {
    const form = promptsPreCompiledForms[0]
    const nextEl = form.nextElementSibling

    form.classList.add('hidden')
    // set correct radio value
    checkRadioValue(form, values[0])
    nextEl.classList.remove('hidden')
  }
}

// set state for prompt 2
const setPromptState2 = (values) => {
  // if free form prompt
  if (promptsForms?.length > 0) {
    const prompt1 = promptsForms[0]
    const prompt2 = promptsForms[1]
    const inputField = prompt1.querySelector('input[type="text"]')
    const submitBtn = prompt1.querySelector('button[type="submit"]')
    const captionNote = prompt1.querySelector('.prompts__caption-note')
    const nextEl = prompt2.nextElementSibling

    // add first state
    disablePrompt(prompt1, values[0])
    // add second state
    disablePrompt(prompt2, values[1])
    // enable next state
    enableNextPrompt(nextEl)
  }

  // if pre-compiled prompts
  if (promptsPreCompiledForms.length > 0) {
    const prompt1 = promptsPreCompiledForms[0]
    const prompt2 = promptsPreCompiledForms[1]
    const nextEl = prompt2.nextElementSibling

    // hide prompt1 form
    prompt1.classList.add('hidden')
    // set correct radio value
    checkRadioValue(prompt1, values[0])
    // hide prompt2 form
    prompt2.classList.add('hidden')
    // set correct radio value
    checkRadioValue(prompt2, values[1])
    // enable next state
    nextEl.classList.remove('hidden')
  }
}

// set state for prompt 3
const setPromptState3 = (values) => {
  if (promptsForms?.length > 0) {
    const prompt1 = promptsForms[0]
    const prompt2 = promptsForms[1]
    const prompt3 = promptsForms[2]
    const nextEl = prompt3.nextElementSibling

    // add first state
    disablePrompt(prompt1, values[0])
    // add second state
    disablePrompt(prompt2, values[1])
    // add third state
    disablePrompt(prompt3, values[2])

    // Set loading state
    setLoadingStatePrompt('Waiting for other players to finish...')
  }

  // if pre-compiled prompts
  if (promptsPreCompiledForms.length > 0) {
    const prompt1 = promptsPreCompiledForms[0]
    const prompt2 = promptsPreCompiledForms[1]
    const prompt3 = promptsPreCompiledForms[2]

    // hide prompt1 form
    prompt1.classList.add('hidden')
    // set correct radio value
    checkRadioValue(prompt1, values[0])
    // hide prompt2 form
    prompt2.classList.add('hidden')
    // set correct radio value
    checkRadioValue(prompt2, values[1])
    // hide prompt3 form
    prompt3.classList.add('hidden')
    // set correct radio value
    checkRadioValue(prompt3, values[2])
    // Set loading state
    setLoadingStatePrompt('Waiting for other players to finish...')
  }
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
    form.find("button").click(function(){
      console.log('dd')
      // e.preventDefault()
      // // set value
      // const prompt = form.querySelector('input[type="text"]').value;
      // disablePrompt(form);
      // $(".loader").find("p").text("Generating...");
      // $(".loader").removeClass('hidden');

      // $.ajax({
      //   url: "/send-prompt",
      //   cache: false,
      //   async: false,
      //   data:{
      //     playerId: playerId,
      //     prompt: prompt,
      //     index: index + 1
      //   },
      //   success: function(data){
      //   }
      // });

      // // hide loader
      // $(".loader").addClass('hidden');

      // if (index < 2){
      //   const currentForm = $('#caption' + (index+1));
      //   currentForm.addClass('submitted');

      //   index += 1;
      //   const nextForm = $('#caption' + (index+1));
      //   nextForm.find('input[type="text"]').removeAttr('disabled');
      //   nextForm.find('.prompts__caption-note').removeClass('hidden');
      // }
      
      // else{
      //   $("#minjkang-loader").find("p").text("Waiting for other player to finish...");
      //   $("#minjkang-loader").removeClass('hidden');
      //   // $("#generation-done").val("y");
      //   promptsForms.addClass("done");
      // }

    });
  })
}

$("#generation-done").change(function(){
  console.log($("#generation-done").val());
  if ($("#generation-done").val() == 'y'){
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

    // form submit event
    form?.addEventListener('submit', (e) => {
      const value = form.querySelector('input[type="text"]').value
      e.preventDefault()
      // set current to hidden
      disableGuess(form)
      // emit socket message
      socket.emit('guess', { message: value, opponentId: document.getElementById('opponentId').textContent, round: document.getElementById('round').textContent});
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
  prompts.classList.remove('hidden');
});
