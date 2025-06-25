const numberOfTries = 6;
const numberOfLetters = 6;
let currentTry = 1;
let numberOfHints = 2;

const words = ["Abroad","Coffee","Delete","Degree","Animal","Health","Column","Racing",
              "Jacket","Hacked","Famous","Hammer","Mainly","Hanger","Number","Before",
              "Friend","Beauty","Strong","Bright","Action","Reward","Genius","Create", 
              "Update", "Master", "Branch", "Coding", "School","Reduce","People","Spread",
              "Backed","Gamers","Indoor","Spring","Return","Remove","Travel"];
let wordToGuess = words[Math.floor(Math.random() * words.length)].toLowerCase();



function generateInput(){
    const inputsContainer = document.querySelector(".inputs");
    if (!inputsContainer) return;
    for(let i = 1; i <= numberOfTries; i++){
        const tryDiv = document.createElement("div");
        tryDiv.classList.add(`try${i}`);
        tryDiv.innerHTML = `<span>Try ${i}</span>`
        if(i !== 1) tryDiv.classList.add("disabled-inputs");
        for(let j = 1; j <= numberOfLetters; j++){
            const input = document.createElement("input");
            input.type = "text";
            input.id = `guess-${i}-letter-${j}`;
            input.setAttribute("maxlength", "1"); 
            tryDiv.appendChild(input);
        }
        inputsContainer.appendChild(tryDiv);
    }
    inputsContainer.children[0].children[1].focus();
    const inputsInDisabledDiv = document.querySelectorAll(".disabled-inputs input");
    inputsInDisabledDiv.forEach((input) => (input.disabled = true));
    const inputs = document.querySelectorAll("input");
    inputs.forEach((input,index) => {
        input.addEventListener("input", function(){
            this.value = this.value.toUpperCase();
            const nextInput = inputs[index + 1]; 
            if(nextInput) nextInput.focus();
        });
        input.addEventListener("keydown", function(event){
            const currentIndex = Array.from(inputs).indexOf(event.target); 
            if(event.key === "ArrowRight" && currentIndex + 1 < inputs.length){
                inputs[currentIndex + 1].focus();
            }
            if(event.key === "ArrowLeft" && currentIndex + 1 >= 0){
                inputs[currentIndex - 1].focus();
            }
        });
    });
}   


function handleGuesses() {
    let successGuess = true;
    const guessBtn = document.querySelector(".check");
    const getHintBtn = document.querySelector(".hint");
    for (let i = 1; i <= numberOfLetters; i++) {
        const inputField = document.querySelector(`#guess-${currentTry}-letter-${i}`);
        const letter = inputField.value.toLowerCase();
        const actualLetter = wordToGuess[i - 1];
        if (letter === actualLetter) {
            inputField.classList.add("yes-in-place");
        } else if (wordToGuess.includes(letter) && letter !== "") {
            inputField.classList.add("not-in-place");
            successGuess = false;
        } else {
            inputField.classList.add("no");
            successGuess = false;
    }
  }
  if(successGuess){
    Swal.fire({
    title: '🎉 You Win!',
    text: `You guessed the word "${wordToGuess.toUpperCase()}" correctly!`,
    icon: 'success',
    confirmButtonText: 'Play Again'
    }).then(() => {
    location.reload(); 
    });
    let allTries = document.querySelectorAll(".inputs > div");
    allTries.forEach((tryDiv) => tryDiv.classList.add("disabled-inputs"));
    guessBtn.disabled = true;
    getHintBtn.disabled = true;
  } else {
    document.querySelector(`.try${currentTry}`).classList.add("disabled-inputs");
    const currentTryInputs = document.querySelectorAll(`.try${currentTry} input`);
    currentTryInputs.forEach((input) => (input.disabled = true));
    
    currentTry++;
    
    const nextTryInputs = document.querySelectorAll(`.try${currentTry} input`);
    nextTryInputs.forEach((input) => (input.disabled = false));
    
    let el = document.querySelector(`.try${currentTry}`);
    if(el){
        el.classList.remove("disabled-inputs");
        el.children[1].focus();
    } else {
        guessBtn.disabled = true;
        getHintBtn.disabled = true;
        Swal.fire({
        title: 'You Lost!',
        text: `The correct word was "${wordToGuess.toUpperCase()}"`,
        icon: 'error',
        confirmButtonText: 'Try Again'
        }).then(() => {
        location.reload(); 
        });
    }
  }
}

function getHint(){
    if(numberOfHints > 0){
        numberOfHints--;
        document.querySelector(".hint span").textContent = numberOfHints;
    }
    const getHintBtn = document.querySelector(".hint");
    if(numberOfHints == 0) getHintBtn.disabled = true;
    const enabledInputs = document.querySelectorAll("input:not([disabled])");
    const emptyEnabledInputs = Array.from(enabledInputs).filter((input) => input.value === "");
    if(emptyEnabledInputs.length > 0){
        const randomIndex = Math.floor(Math.random() * emptyEnabledInputs.length);
        const randomInput = emptyEnabledInputs[randomIndex];
        const indexToFill = Array.from(enabledInputs).indexOf(randomInput);
        if(indexToFill !== -1){
            randomInput.value = wordToGuess[indexToFill].toUpperCase();
        }
    }   
}

function handleBackspace(event){
    if(event.key === "Backspace"){
        const inputs = document.querySelectorAll("input:not([disabled])");
        const currentIndex = Array.from(inputs).indexOf(document.activeElement);
        if(currentIndex > 0){
            const currentInput = inputs[currentIndex];
            currentInput.value = "";
            currentInput.focus();
        }
    }
}
document.addEventListener("keydown", handleBackspace);

document.addEventListener("DOMContentLoaded", function () {
    const gameName = "Guess the word";
    document.title = gameName;
    const gameH1 = document.querySelector(".game-h1");
    if (gameH1) gameH1.textContent = gameName;
    const footer = document.querySelector("footer");
    if(footer) footer.innerHTML = `${gameName} game created by hana in 2025`;
    const hintSpan = document.querySelector(".hint span");
    if (hintSpan) hintSpan.textContent = numberOfHints;

    const getHintBtn = document.querySelector(".hint");
    if(getHintBtn) getHintBtn.addEventListener("click", getHint);

    const guessBtn = document.querySelector(".check");
    if(guessBtn) guessBtn.addEventListener("click", handleGuesses);

    generateInput();
});