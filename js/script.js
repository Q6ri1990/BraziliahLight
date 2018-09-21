// Initiate the service worker
var sw = '../dist/sw_cached_site.js';
// Make sure sw are supported
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker
            .register(sw)
            .then(reg => console.log('Service Worker: Registered (Pages):' + sw))
            .catch(err => console.log(`Service Worker: Error: ${err}`));
    });
}

// Detects if device is on iOS 
const isIos = () => {
    const userAgent = window.navigator.userAgent.toLowerCase();
    return /iphone|ipad|ipod/.test(userAgent);
}
// Detects if device is in standalone mode
const isInStandaloneMode = () => ('standalone' in window.navigator) && (window.navigator.standalone);

// Checks if should display install popup notification:
if (isIos() && !isInStandaloneMode()) {
    // this is using react for some reason
    //this.setState({ showInstallMessage: true });
    document.getElementById("iosInstallHint").className = "installPopup";
}

// define the Team class
class Team {
    constructor(name, score) {
        this.name = name;
        this.score = score;
        this.scoreList = new Array();
        this.ScoreBoardText = "";
    }

    changeName(updatedName) {
        if (updatedName !== "") {
            this.name = updatedName;
        }
    }

    addScore(newScore) {
        newScore = parseInt(newScore, 10) || 0; // get the number or 0 if it is null
        newScore = Math.ceil(newScore / 10) * 10; // round up to the next 10
        this.scoreList.push(newScore);
        this.calculateTotal();
    }

    calculateTotal() {
        var total = 0,
            temp = "";
        //        this.ScoreBoardText="";
        for (var i = 0; i < this.scoreList.length; i++) {
            total = this.scoreList[i] + total;
            temp = temp + this.scoreList[i] + "<br>";

        }
        this.score = total;
        this.ScoreBoardText = "<b>" + total + "</b>" + "<br>" + temp;

    }

    isSuper() {
        return this.score >= 1000;
    };

    deleteLastScore() {
        this.scoreList.pop();
        this.calculateTotal();
    }

    resetAllScores() {
        this.scoreList = new Array();
    }
}

// get the DOM objects
const alphaInput = document.getElementById("alphaScore");
const bravoInput = document.getElementById("bravoScore");
const alphaScoreBoard = document.getElementById("alphaScoreList");
const bravoScoreBoard = document.getElementById("bravoScoreList");
const alphaStatus = document.getElementById("alphaStatus");
const bravoStatus = document.getElementById("bravoStatus");
var alphaFirstSuper = true,
    bravoFirstSuper = true;

const alphaName = document.getElementById("alphaName");
const bravoName = document.getElementById("bravoName");

alphaName.addEventListener('click', () => {changeName("a")});
bravoName.addEventListener('click', () => {changeName("b")});

// create team objects
const alpha = new Team("Alpha", 0);
const bravo = new Team("Bravo", 0);

alphaInput.placeholder=alpha.name;
bravoInput.placeholder=bravo.name;
function changeName(teamName) {
    var name = prompt("Please enter your name", "( ͡° ͜ʖ ͡°)");

    if (name == null || name == "") {

    }else if(teamName=="a"){
        alpha.changeName(name);
        alphaName.innerText=alpha.name;
        alphaInput.placeholder=alpha.name;
    }else if(teamName=="b"){
        bravo.changeName(name);
        bravoName.innerText=bravo.name;
        bravoInput.placeholder=bravo.name;
    }
}

function calculateScores() {
    alpha.addScore(alphaInput.value);

    bravo.addScore(bravoInput.value);
    updateScoreBoards();

    alphaInput.value = "";
    bravoInput.value = "";
}

function deletePreviousScore() {
    alpha.deleteLastScore();
    bravo.deleteLastScore();
    updateScoreBoards();

}

function updateScoreBoards() {
    alphaScoreBoard.innerHTML = alpha.ScoreBoardText;
    bravoScoreBoard.innerHTML = bravo.ScoreBoardText;
    checkSuperState();
}

function checkSuperState() {
    var play = false;
    var omg = false;
    var sound = "";
    if (alpha.score >= 2000 && bravo.score >= 2000) {
        if (alpha.score > bravo.score) {
            alphaStatus.innerText = "Win";
            alphaStatus.style.color = "#006400";
            bravoStatus.innerText = "Lose";
        } else if (alpha.score == bravo.score) {
            alphaStatus.innerText = "Draw";
            bravoStatus.innerText = "Draw";
        } else {
            alphaStatus.innerText = "Lose";
            bravoStatus.innerText = "Win";
            bravoStatus.style.color = "#006400";

        }
    } else if (alpha.score >= 2000) {
        alphaStatus.innerText = "Win";
        bravoStatus.innerText = "Lose";
        alphaStatus.style.color = "#006400";
    } else if (bravo.score >= 2000) {
        alphaStatus.innerText = "Lose";
        bravoStatus.innerText = "Win";
        bravoStatus.style.color = "#006400";
    } else {

        if (alpha.isSuper()) {
            alphaStatus.innerText = "Super";
            alphaStatus.className = "superState";
            if (alphaFirstSuper == true) {
                alphaFirstSuper = false;
                sound = "super";
                play = true;
            }
        } else {
            alphaStatus.innerText = "";
            alphaStatus.className = "";
        }


        if (bravo.isSuper()) {
            bravoStatus.innerText = "Super";
            bravoStatus.className = "superState";
            if (bravoFirstSuper == true) {
                bravoFirstSuper = false;
                play = true;
                sound = "super";
            }
        } else {
            bravoStatus.innerText = "";
            bravoStatus.className = "";
        }

        if (bravo.isSuper() && alpha.isSuper()) {
            if (bravo.score == alpha.score) {
                omg = true;
                play = true;
            } else {
                var diff = Math.max(alpha.score, bravo.score) - Math.min(alpha.score, bravo.score);
                omg = (diff <= 200) && (diff > 0);
                play = true;
            }
        }
    }
    if (omg) {
        playSound("OMG");
    } else if (play) {
        playSound(sound);
    }
}

function playSound(name) {
    if (document.getElementById("play").checked == true) {
        if ("super" == name) {
            name = "super.mp3";
        } else if ("OMG" == name) {
            name = "omg.mp3";
        } else if (name == "Victory") {
            name = "";
        }

        var snd = new Audio("../dist/audio/" + name); // buffers automatically when created
        snd.crossOrigin='anonymous';
        snd.play();
    }
}