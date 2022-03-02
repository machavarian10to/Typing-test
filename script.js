const randomQuoteUrl = "https://api.quotable.io/random?minLength=80&maxLength-100";
const quoteSection = document.getElementById("quote-section");
const quoteAuthorSection = document.getElementById("quote-author-section");
const userInput = document.getElementById("quote-input");

let quote = "";
let quoteAuthor = "";
let timer = "";
let time = 60;
let mistakes = 0;

window.onload = () => {
    getNewQuote();
    userInput.disabled = true;
}


// Render new quote, its author and append it on page 
const getNewQuote = async () => {
    const response = await fetch(randomQuoteUrl);
    let data = await response.json();
    quote = data.content;
    quoteAuthor = data.author;

    let quoteChars = quote.split("").map(value => {
        return "<span class='quote-chars'>" + value + "</span>"
    })

    quoteSection.innerHTML = quoteChars.join("");

    quoteAuthorSection.innerHTML = "- " + quoteAuthor;
}


// Start the test and timer
function startTest() {
    mistakes = 0;
    time = 60;
    timer = "";
    userInput.value = "";
    userInput.disabled = false;
    userInput.focus()
    document.getElementById("start-test").style.display = "none";
    document.getElementById("finish-test").style.display = "block";
    setTimer();
}

function setTimer() {
    timer = setInterval(updateTimer, 1000);
}

function updateTimer() {
    if(time == 0) {
        displayResults();
    }else{
        document.getElementById("timer").innerText = --time + "s";
    }
}

// Restart the test and timer
function restartTest() {
    startTest();
    getNewQuote();
    document.getElementById("mistakes").innerText = mistakes;
    document.getElementById("restart-test").style.display = "none";
    document.querySelector(".results").style.display = "none";
    document.getElementById("finish-test").style.display = "block";
}


// Check user input, if it matches quote -> letters become green, if not become red 
userInput.addEventListener("input", () => {
    let userInputChars = userInput.value.split("");

    let quoteCharsArr = Array.from(document.querySelectorAll(".quote-chars"));
    quoteCharsArr.forEach((char, index) => {
        if(char.innerHTML == userInputChars[index]) {
            char.classList.add("success");
        }else if(userInputChars[index] == null) {
            if(char.classList.contains("success")) {
                char.classList.remove("success");
            }else {
                char.classList.remove("fail");
            }
        }else{
            if(!char.classList.contains("fail")) {
                mistakes++;
                char.classList.add("fail");
            }
            document.getElementById("mistakes").innerText = mistakes;
        }
    })
    
    let isTestFinished = quoteCharsArr.every(letter => letter.classList.contains("success"));

    if(isTestFinished) {
        displayResults();
    }
})


// End the test, summarize results and display on screen
function displayResults() {
    clearInterval(timer);
    userInput.disabled = true;
    document.querySelector(".results").style.display = "block";
    document.getElementById("restart-test").style.display = "block";   
    document.getElementById("finish-test").style.display = "none";   

    let timeTaken = 1;
    let accuracy = 0;
    let wpm = 0;
    if(time != 0) {
        timeTaken = (60 - time) / 100;
    }

    if(userInput.value.length > 0) {
        accuracy = Math.round(((userInput.value.length - mistakes) / userInput.value.length) * 100) + " %";
        wpm = (userInput.value.length / 5 / timeTaken).toFixed(2) + " wpm";
    }
    document.getElementById("accuracy").innerText = accuracy;
    document.getElementById("wpm").innerText = wpm;
}


