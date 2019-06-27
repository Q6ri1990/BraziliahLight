const home = "../dist/";

// indexDB variables
// check if the indexDB is supported or not
function isIndexDBSupported() {
    if (!('indexedDB' in window)) {
        alert("your data might not be saved properly");
        return false;
    }
    console.log("Supported");
    //alert("IDB Supported");
    return true;
}

const dbName = 'Brazilliah',
    tableName = 'Brazilliah',
    version = 1,
    useDB = isIndexDBSupported();


// create the database
function createIndexedDB() {
    if (useDB) {
        return idb.open(dbName, version, function (upgradeDb) {
            // alert("Creating DB " + dbName);
            if (!upgradeDb.objectStoreNames.contains(tableName)) {
                //  alert("upgrading table " + tableName);
                const eventsOS = upgradeDb.createObjectStore(tableName,{keyPath: 'id'});
            }
        });
    }
}

// create the promise object that will be used by the application
const dbPromise = createIndexedDB();

// functions that utilize the indexDB
function saveObject(records) {
    if (isIndexDBSupported()) {
        return dbPromise.then(db => {
            const tx = db.transaction(tableName, 'readwrite');
            const store = tx.objectStore(tableName);
            return Promise.all(records.map(record => store.put(record)))
            .catch(e => {
                tx.abort();
                alert(e);  
                throw Error('Events were not added to the store ');
            });
        });
    }
}

function findById(id) {
    if (isIndexDBSupported()) {
        return dbPromise.then(function (db) {
            var tx = db.transaction(tableName, 'readonly');
            var store = tx.objectStore(tableName);
            return store.get(id);
        });
    }
}


function getStoredObject(key) {
    if (useDB) {
       return findById(key).then(item => {
            if(item ===null|| item === undefined){
                alert('new team');
                return  new Team(key,getText(key),0);
            }else{
                return  item;
            }
        }
        ).catch(e=>console.log(e));
    } else {
        // use the localStorage
        if (localStorage.getItem(key)) {
            return localStorage.getItem(key);
        }else{
           return new Team(key,getText(key),0);
        }
    }
}





/* // Initiate the service worker
var sw = home + 'sw_cached_site.js';
// Make sure sw are supported
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker
            .register(sw)
            .then(reg => console.log('Service Worker: Registered (Pages):' + sw))
            .catch(err => console.log(`Service Worker: Error: ${err}`));
    });
} */

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
    constructor(id, name, score) {
        this.id = id;
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

    isAbove2000() {
        return this.score >= 2000
    }

    deleteLastScore() {
        this.scoreList.pop();
        this.calculateTotal();
    }

    resetAllScores() {
        this.scoreList = new Array();
        this.ScoreBoardText = "";
    }

    revive(data) {
        Object.assign(this, data);
   }

}

// persistence
function persist() {
    if (useDB) {
        saveObject([alpha,bravo]);
        // do something for the options as well
    } else {
        localStorage.setItem('Alpha', JSON.stringify(alpha));
        localStorage.setItem('Bravo', JSON.stringify(bravo));
    }
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

/*if(isIos()){
    var pattern="[0-9]*";
    alphaInput.type="number";
    alphaInput.pattern=pattern;
    alphaInput.min="-1";
    bravoInput.type="number";
    bravoInput.pattern=pattern;
}*/

alphaName.addEventListener('click', () => {
    changeName("a")
});


bravoName.addEventListener('click', () => {
    changeName("b")
});

// create the variables
var alphaFirstSuper = true,
    bravoFirstSuper = true;


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
let alpha = new Team("Alpha",getText("alpha"), 0);
let bravo = new Team("Bravo",getText("bravo"), 0);

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

    var update = true;

    getStoredObject("Alpha").then(team=>{
        alpha.revive(team);
    });
    getStoredObject("Bravo").then(team=>{
        bravo.revive(team);
        updateScoreBoards();
    });
    
    /*if (localStorage.getItem("Alpha")) {

        alpha.revive(JSON.parse(localStorage.getItem("Alpha")))
        update = true;
    }

    if (localStorage.getItem("Bravo")) {
        bravo.revive(JSON.parse(localStorage.getItem("Bravo")))
        update = true;
    }
    */
    if (!localStorage.getItem("lang") || !localStorage.getItem("sound")) {
        document.getElementById("drawer-toggle-label").classList.add("glowAnimation");
    } else {
        changeLanguage();
    }

     //updateScoreBoards();
}

revive();
updateTexts();

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

function newGame() {
    alpha.resetAllScores();
    bravo.resetAllScores();
    updateScoreBoards();
    alphaStatus.innerText = "";
    bravoStatus.innerText = "";
}

function updateTexts() {
    document.getElementById("title").textContent = getText("appName");
    document.getElementById("newGameBtn").textContent = getText("newGame");
    document.getElementById("CalculateBtn").textContent = getText("addScore");
    document.getElementById("deleteBtn").textContent = getText("deleteScore");
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
    localStorage.setItem("sound", document.getElementById("play").checked);
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