// Make sure sw are supported
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker
            .register('../sw_cached_site.js')
            .then(reg => console.log('Service Worker: Registered (Pages)'))
            .catch(err => console.log(`Service Worker: Error: ${err}`));
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
            alphaStatus.innerText="Win";
            alphaStatus.style.color = "#006400";
            bravoStatus.innerText="Lose";
        } else if (alpha.score == bravo.score) {
            alphaStatus.innerText="Draw";
            bravoStatus.innerText="Draw";
        } else {
            alphaStatus.innerText="Lose";
            bravoStatus.innerText="Win";
            bravoStatus.style.color = "#006400";

        }
    } else if (alpha.score >= 2000) {
        alphaStatus.innerText="Win";
        bravoStatus.innerText="Lose";
        alphaStatus.style.color = "#006400";
    } else if (bravo.score >= 2000) {
        alphaStatus.innerText="Lose";
        bravoStatus.innerText="Win";
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
            alphaStatus.className="";
        }


        if (bravo.isSuper()) {
            bravoStatus.innerText = "Super";
            bravoStatus.className="superState";
            if (bravoFirstSuper) {
                play = true;
                bravoFirstSuper = false;
            }
        } else {
            bravoStatus.innerText = "";
            bravoStatus.className="";
        }
    }
}

/**
 * Java Code
 * private void updateStatus() {

        boolean play = false, omg = false;
        alphaScore.setText(alpha.getScore() + "");
        bravoScore.setText(bravo.getScore() + "");
        alphaTrace.setText(alpha.getPreviousScore());
        bravoTrace.setText(bravo.getPreviousScore());


        if (alpha.getScore() >= 2000 && bravo.getScore() >= 2000) {
            if (alpha.getScore() > bravo.getScore()) {
                alphaStatus.setText(getText(R.string.Win));
                alphaStatus.setTextColor(Color.parseColor("#006400"));
                bravoStatus.setText(getText(R.string.Lose));
            } else if (alpha.getScore() == bravo.getScore()) {
                alphaStatus.setText(getText(R.string.Draw));
                bravoStatus.setText(getText(R.string.Draw));
            } else {
                alphaStatus.setText(getText(R.string.Lose));
                bravoStatus.setText(getText(R.string.Win));
                bravoStatus.setTextColor(Color.parseColor("#006400"));

            }
        } else if (alpha.getScore() >= 2000) {
            alphaStatus.setText(getText(R.string.Win));
            bravoStatus.setText(getText(R.string.Lose));
            alphaStatus.setTextColor(Color.parseColor("#006400"));
        } else if (bravo.getScore() >= 2000) {
            alphaStatus.setText(getText(R.string.Lose));
            bravoStatus.setText(getText(R.string.Win));
            bravoStatus.setTextColor(Color.parseColor("#006400"));
        } else {


            if (alpha.getScore() < 1000) {
                alphaFirstSuper = true;
                alphaStatus.setText(R.string.initialStatus);
            } else if (alpha.isSuper()) {
                alphaStatus.setText(getString(R.string.Super));
                alphaStatus.setTextColor(Color.RED);
                if (alphaFirstSuper) {
                    play = true;
                    alphaFirstSuper = false;
                }
            }

            if (bravo.getScore() < 1000) {
                bravoStatus.setText(R.string.initialStatus);
                bravoFirstSuper = true;
            } else if (bravo.isSuper()) {
                bravoStatus.setText(getString(R.string.Super));
                bravoStatus.setTextColor(Color.RED);
                if (bravoFirstSuper) {
                    play = true;
                    bravoFirstSuper = false;
                }
            }
        }
        if (bravo.isSuper() && alpha.isSuper()) {
            if(bravo.getScore() == alpha.getScore())
            {
                omg = true;
            }else {
                int diff = Math.max(alpha.getScore(), bravo.getScore()) - Math.min(alpha.getScore(), bravo.getScore());
                int margin = PreferenceManager.getDefaultSharedPreferences(getApplicationContext()).getInt("margin", 200) ;
                omg = diff <= margin && diff > 0;
            }
        }

        if (omg) {
            playSound(R.raw.omg);
        } else if (play) {
            playSound(R.raw.suuper);
        }


    }

    private void playSound(int s) {
        sound = MediaPlayer.create(getApplicationContext(), s);
        sound.start();

    }

 * 
 * 
 */