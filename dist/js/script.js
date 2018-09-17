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
    this.setState({
        showInstallMessage: true
    });
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
        this.scoreList.push(parseInt(newScore, 10) || 0);
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

// create team objects
const alpha = new Team("Alpha", 0);
const bravo = new Team("Bravo", 0);


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
            if (alphaFirstSuper) {
                play = true;
                alphaFirstSuper = false;
            }
        } else {
            alphaStatus.innerText = "";
            alphaStatus.className = "";
        }


        if (bravo.isSuper()) {
            bravoStatus.innerText = "Super";
            bravoStatus.className = "superState";
            if (bravoFirstSuper) {
                play = true;
                bravoFirstSuper = false;
            }
        } else {
            bravoStatus.innerText = "";
            bravoStatus.className = "";
        }
    }
}