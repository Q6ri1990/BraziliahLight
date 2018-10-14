const home = "../dist/";

// Initiate the service worker
var sw = home+'sw_cached_site.js';
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
        this.ScoreBoardText = "";
    }

    revive(data){
        Object.assign(this,data);
    }

}

// persistence
function persist(){
    localStorage.setItem('Alpha',JSON.stringify(alpha));
    localStorage.setItem('Bravo',JSON.stringify(bravo)); 
}



// get the DOM objects
const alphaInput = document.getElementById("alphaScore");
const bravoInput = document.getElementById("bravoScore");
const alphaScoreBoard = document.getElementById("alphaScoreList");
const bravoScoreBoard = document.getElementById("bravoScoreList");
const alphaStatus = document.getElementById("alphaStatus");
const bravoStatus = document.getElementById("bravoStatus");

const alphaName = document.getElementById("alphaName");
const bravoName = document.getElementById("bravoName");

if(isIos()){
    alphaInput.type="text";
    alphaInput.pattern="^[-+]?\d*$";
    bravoInput.type="text";
    bravoInput.pattern="^[-+]?\d*$";

}

alphaName.addEventListener('click', () => {
    changeName("a")
});


bravoName.addEventListener('click', () => {
    changeName("b")
});

// create the variables
var alphaFirstSuper = true,bravoFirstSuper = true;


// translations example
var translations = 
{ 
   // "en" : { "SomeText" : "Test in English", "SomeOtherText" : "Another Test in English"  },
   // "ar" : { "" : "", "":""}

   "en" : { "addScore": "Add Score", "alpha": "Alpha", "appName": "Braziliah Light", "bravo": "Bravo", "changeName": "Please enter your name", "deleteScore": "Delete Last Score", "draw": "Draw", "lose": "Lost", "newGame": "New Game", "super": "Super", "win": "Won"},
   "ar" : { "addScore": "احسب", "alpha": "لنا", "appName": "حاسبة البرازيلية", "bravo": "لهم", "changeName": "اسم الفريق", "deleteScore": "امسح المجموع السابق", "draw": "تعادل", "lose": "خسر", "newGame": "قيم جديد", "super": "سوبر", "win": "فاز"}
  
  
};

var language = "en";


// create team objects
const alpha = new Team(getText("alpha"), 0);
const bravo = new Team(getText("bravo"), 0);

updateTexts();

function checkSuperState() {
    var play = false;
    var omg = false;
    var sound = "";
    if (alpha.score >= 2000 && bravo.score >= 2000) {
        if (alpha.score > bravo.score) {
            alphaStatus.innerText = getText("win");
            alphaStatus.style.color = "#006400";
            bravoStatus.innerText = getText("lose");
        } else if (alpha.score == bravo.score) {
            alphaStatus.innerText = getText("draw");
            bravoStatus.innerText = getText("draw");
        } else {
            alphaStatus.innerText = getText("lose");
            bravoStatus.innerText = getText("win");
            bravoStatus.style.color = "#006400";

        }
    } else if (alpha.score >= 2000) {
        alphaStatus.innerText = getText("win");
        bravoStatus.innerText = getText("lose");
        alphaStatus.style.color = "#006400";
    } else if (bravo.score >= 2000) {
        alphaStatus.innerText = getText("lose");
        bravoStatus.innerText = getText("win");
        bravoStatus.style.color = "#006400";
    } else {

        if (alpha.isSuper()) {
            alphaStatus.innerText = getText("super");
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
            bravoStatus.innerText = getText("super");
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

        var snd = new Audio("audio/" + name); // buffers automatically when created
        snd.crossOrigin = 'anonymous';
        snd.play();
    }
}

function revive(){

    var update = false;
    if(localStorage.getItem("Alpha"))
    {
        alpha.revive(JSON.parse(localStorage.getItem("Alpha")))
        update=true;
    }

    if(localStorage.getItem("Bravo"))
    {
        bravo.revive(JSON.parse(localStorage.getItem("Bravo")))
        update=true;
    }   
    
    update?updateScoreBoards():console.log("Nothing to revive");
}

revive();


alphaInput.placeholder = alpha.name;
bravoInput.placeholder = bravo.name;

function updateScoreBoards() {
    alphaScoreBoard.innerHTML = alpha.ScoreBoardText;
    bravoScoreBoard.innerHTML = bravo.ScoreBoardText;
    checkSuperState();    
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
    persist();
}

function newGame(){
    alpha.resetAllScores();
    bravo.resetAllScores();
    updateScoreBoards();
    alphaStatus.innerText="";
    bravoStatus.innerText="";
}

function updateTexts(){
    document.getElementById("title").textContent=getText("appName");
    document.getElementById("newGameBtn").textContent=getText("newGame");
    document.getElementById("CalculateBtn").textContent=getText("addScore");
    document.getElementById("deleteBtn").textContent=getText("deleteScore"); 
    updateScoreBoards();   
}

function getText(name){
    if (translations[language].hasOwnProperty(name))
      return translations[language][name];
}

function changeLanguage(){
    if (document.getElementById("lang").checked == true)
    {
        language="ar";
    }else{
        language="en";
    }
    updateTexts();
}