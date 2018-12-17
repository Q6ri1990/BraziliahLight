const home = "../dist/";

// Initiate the service worker
var sw = home + 'sw_cached_site.js';
// Make sure sw are supported
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker
            .register(sw)
            .then(reg => console.log('Service Worker: Registered (Pages):' + sw))
            .catch(err => console.log(`Service Worker: Error: ${err}`));
    });
}

// Detects if device is on iOS 
function isIos() {
    const userAgent = window.navigator.userAgent.toLowerCase();
    return /iphone|ipad|ipod/.test(userAgent);
}
// Detects if device is in standalone mode
function isInStandaloneMode  () {
    return ('standalone' in window.navigator) && (window.navigator.standalone);
}
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
        this.firstSuper = true;
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
    }

    isFirstSuper(){
        return this.firstSuper;
    }

    isAbove2000() {
        return this.score >= 2000;
    }

    deleteLastScore() {
        this.scoreList.pop();
        this.calculateTotal();
    }

    resetAllScores() {
        this.scoreList = new Array();
        this.ScoreBoardText = "";
        this.firstSuper = true;
    }

    updateIsFirstSuper(firstSuper){
        this.firstSuper=firstSuper;
    }

    revive(data) {
        Object.assign(this, data);
    }

}

// persistence
function persist() {
    localStorage.setItem('Alpha', JSON.stringify(alpha));
    localStorage.setItem('Bravo', JSON.stringify(bravo));
}



// get the DOM objects
var alphaInput = document.getElementById("alphaScore");
var bravoInput = document.getElementById("bravoScore");
var alphaScoreBoard = document.getElementById("alphaScoreList");
var bravoScoreBoard = document.getElementById("bravoScoreList");
var alphaStatus = document.getElementById("alphaStatus");
var bravoStatus = document.getElementById("bravoStatus");
var soundToggle = document.getElementById("play");
var alphaName = document.getElementById("alphaName");
var bravoName = document.getElementById("bravoName");

/*if(isIos()){
    var pattern="[0-9]*";
    alphaInput.type="number";
    alphaInput.pattern=pattern;
    alphaInput.min="-1";
    bravoInput.type="number";
    bravoInput.pattern=pattern;
}*/

alphaName.addEventListener('click', function() {
    changeName("a")
});


bravoName.addEventListener('click', function() {
    changeName("b")
});

// create the variables
var alphaFirstSuper = true;
var bravoFirstSuper = true;


// translations example
var translations = {
    "en": {
        "addScore": "Add Score",
        "alpha": "Alpha",
        "appName": "Braziliah Light",
        "bravo": "Bravo",
        "changeName": "Please enter your name",
        "deleteScore": "Delete Last Score",
        "draw": "Draw",
        "lose": "Lost",
        "newGame": "New Game",
        "super": "Super",
        "win": "Won"
    },
    "ar": {
        "addScore": "احسب",
        "alpha": "لنا",
        "appName": "حاسبة البرازيلية",
        "bravo": "لهم",
        "changeName": "اسم الفريق",
        "deleteScore": "امسح المجموع السابق",
        "draw": "تعادل",
        "lose": "خسر",
        "newGame": "قيم جديد",
        "super": "سوبر",
        "win": "فاز"
    }
};

var language = "en";


// create team objects
var alpha = new Team(getText("alpha"), 0);
var bravo = new Team(getText("bravo"), 0);

function checkSuperState() {
    var play = false;
    var omg = false;
    var sound = "";
    if (alpha.isAbove2000() && bravo.isAbove2000() && alpha.score == bravo.score) {
        alphaStatus.innerText = getText("draw");
        bravoStatus.innerText = getText("draw");
        alphaStatus.className = "skew-20";
        bravoStatus.className = "skew-20";
    } else if (alpha.isAbove2000() && alpha.score > bravo.score) {
        declareWinner(alphaStatus, bravoStatus);
    } else if (bravo.isAbove2000() && alpha.score < bravo.score) {
        declareWinner(bravoStatus, alphaStatus);
    } else {
        if (alpha.isSuper()) {
            alphaStatus.innerText = getText("super");
            alphaStatus.className = "superState";
            if (alpha.isFirstSuper()) {
                alpha.updateIsFirstSuper(false);
                sound = "super";
                play = true;
            }
        } else {
            alphaStatus.innerText = "";
            alphaStatus.className = "";
        }

        if (bravo.isSuper()) {
            bravoStatus.innerText = getText("super");
            bravoStatus.className = "superState";
            if (bravo.isFirstSuper()) {
                bravo.updateIsFirstSuper(false);
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
        if (omg) {
            playSound("OMG");
        } else if (play) {
            playSound(sound);
        }
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

        var snd = new Audio("audio/" + name); // buffers automatically when created
        snd.crossOrigin = 'anonymous';
        snd.play();
    }
}

function revive() {
    if (localStorage.getItem("lang")) {
        changeLanguage();
    } else {
        document.getElementById("drawer-toggle-label").classList.add("glowAnimation");
    }

    if(localStorage.getItem("sound"))
    {
        soundToggle.checked = localStorage.getItem("sound")=="true";
    }else{
        document.getElementById("drawer-toggle-label").classList.add("glowAnimation");
    }
    var update = false;
    if (localStorage.getItem("Alpha")) {
        alpha.revive(JSON.parse(localStorage.getItem("Alpha")))
        update = true;
    }else{
        alpha.changeName(getText("alpha"));
    }

    if (localStorage.getItem("Bravo")) {
        bravo.revive(JSON.parse(localStorage.getItem("Bravo")))
        update = true;
    }else{
        bravo.changeName(getText("bravo"));
    }



    update ? updateScoreBoards() : console.log("Nothing to revive");
}

revive();
updateTexts();

alphaInput.placeholder = alpha.name;
bravoInput.placeholder = bravo.name;

function updateScoreBoards() {
    alphaScoreBoard.innerHTML = alpha.ScoreBoardText;
    bravoScoreBoard.innerHTML = bravo.ScoreBoardText;
    checkSuperState();
    persist();
}

function changeName(teamName) {
    var name = prompt(translations[language].changeName, "( ͡° ͜ʖ ͡°)");

    if (name == null || name == "") {

    } else if (teamName == "a") {
        alpha.changeName(name);
        alphaName.innerText = alpha.name;
        alphaInput.placeholder = alpha.name;
    } else if (teamName == "b") {
        bravo.changeName(name);
        bravoName.innerText = bravo.name;
        bravoInput.placeholder = bravo.name;
    }
    persist();
}

function calculateScores() {
    alpha.addScore(alphaInput.value);

    bravo.addScore(bravoInput.value);
    updateScoreBoards();

    alphaInput.value = "";
    bravoInput.value = "";
    persist();
}

function deletePreviousScore() {
    alpha.deleteLastScore();
    bravo.deleteLastScore();
    updateScoreBoards();
   // persist();
}

function newGame() {
    alpha.resetAllScores();
    bravo.resetAllScores();
    updateScoreBoards();
    alphaStatus.innerText = "";
    bravoStatus.innerText = "";
  //  persist();
}

function updateTexts() {
    document.getElementById("title").textContent = getText("appName");
    document.getElementById("newGameBtn").textContent = getText("newGame");
    document.getElementById("CalculateBtn").textContent = getText("addScore");
    document.getElementById("deleteBtn").textContent = getText("deleteScore");
    alphaInput.placeholder = alpha.name;
    bravoInput.placeholder = bravo.name;
    updateScoreBoards();
}

function getText(name) {
    if (translations[language].hasOwnProperty(name))
        return translations[language][name];
}

function changeLanguage() {
    if (document.getElementById("lang").checked == true) {
        language = "ar";
    } else {
        language = "en";
    }

    localStorage.setItem("lang", language);
    removeGlow();
    updateTexts();
}

function toggleSounds() {
    localStorage.setItem("sound", soundToggle.checked);
    removeGlow();
}

function removeGlow() {
    document.getElementById("drawer-toggle-label").classList.remove("glowAnimation");
}

function declareWinner(winner, loser) {
    winner.innerText = getText("win");
    winner.classList.add("animation");
    winner.style.color = "#006400";
    loser.innerText = getText("lose");
    loser.style.color = "red";
}