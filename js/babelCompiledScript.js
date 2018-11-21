"use strict";
var _createClass = (function() {
  function a(b, c) {
    for (var e, d = 0; d < c.length; d++)
      (e = c[d]),
        (e.enumerable = e.enumerable || !1),
        (e.configurable = !0),
        "value" in e && (e.writable = !0),
        Object.defineProperty(b, e.key, e);
  }
  return function(b, c, d) {
    return c && a(b.prototype, c), d && a(b, d), b;
  };
})();
function _classCallCheck(a, b) {
  if (!(a instanceof b))
    throw new TypeError("Cannot call a class as a function");
}
var home = "../dist/",
  sw = home + "sw_cached_site.js";
"serviceWorker" in navigator &&
  window.addEventListener("load", function() {
    navigator.serviceWorker
      .register(sw)
      .then(function() {
        return console.log("Service Worker: Registered (Pages):" + sw);
      })
      .catch(function(a) {
        return console.log("Service Worker: Error: " + a);
      });
  });
var isIos = function() {
    var a = window.navigator.userAgent.toLowerCase();
    return /iphone|ipad|ipod/.test(a);
  },
  isInStandaloneMode = function() {
    return "standalone" in window.navigator && window.navigator.standalone;
  };
isIos() &&
  !isInStandaloneMode() &&
  (document.getElementById("iosInstallHint").className = "installPopup");
var Team = (function() {
  function a(b, c) {
    _classCallCheck(this, a),
      (this.name = b),
      (this.score = c),
      (this.scoreList = []),
      (this.ScoreBoardText = "");
  }
  return (
    _createClass(a, [
      {
        key: "changeName",
        value: function(b) {
          "" !== b && (this.name = b);
        }
      },
      {
        key: "addScore",
        value: function addScore(b) {
          (b = parseInt(b, 10) || 0),
            (b = 10 * Math.ceil(b / 10)),
            this.scoreList.push(b),
            this.calculateTotal();
        }
      },
      {
        key: "calculateTotal",
        value: function calculateTotal() {
          for (var b = 0, c = "", d = 0; d < this.scoreList.length; d++)
            (b = this.scoreList[d] + b), (c = c + this.scoreList[d] + "<br>");
          (this.score = b), (this.ScoreBoardText = "<b>" + b + "</b><br>" + c);
        }
      },
      {
        key: "isSuper",
        value: function isSuper() {
          return 1e3 <= this.score;
        }
      },
      {
        key: "isAbove2000",
        value: function isAbove2000() {
          return 2e3 <= this.score;
        }
      },
      {
        key: "deleteLastScore",
        value: function deleteLastScore() {
          this.scoreList.pop(), this.calculateTotal();
        }
      },
      {
        key: "resetAllScores",
        value: function resetAllScores() {
          (this.scoreList = []), (this.ScoreBoardText = "");
        }
      },
      {
        key: "revive",
        value: function(b) {
          Object.assign(this, b);
        }
      }
    ]),
    a
  );
})();
function persist() {
  localStorage.setItem("Alpha", JSON.stringify(alpha)),
    localStorage.setItem("Bravo", JSON.stringify(bravo));
}
var alphaInput = document.getElementById("alphaScore"),
  bravoInput = document.getElementById("bravoScore"),
  alphaScoreBoard = document.getElementById("alphaScoreList"),
  bravoScoreBoard = document.getElementById("bravoScoreList"),
  alphaStatus = document.getElementById("alphaStatus"),
  bravoStatus = document.getElementById("bravoStatus"),
  alphaName = document.getElementById("alphaName"),
  bravoName = document.getElementById("bravoName");
alphaName.addEventListener("click", function() {
  changeName("a");
}),
  bravoName.addEventListener("click", function() {
    changeName("b");
  });
var alphaFirstSuper = !0,
  bravoFirstSuper = !0,
  translations = {
    en: {
      addScore: "Add Score",
      alpha: "Alpha",
      appName: "Braziliah Light",
      bravo: "Bravo",
      changeName: "Please enter your name",
      deleteScore: "Delete Last Score",
      draw: "Draw",
      lose: "Lost",
      newGame: "New Game",
      super: "Super",
      win: "Won"
    },
    ar: {
      addScore: "\u0627\u062D\u0633\u0628",
      alpha: "\u0644\u0646\u0627",
      appName:
        "\u062D\u0627\u0633\u0628\u0629 \u0627\u0644\u0628\u0631\u0627\u0632\u064A\u0644\u064A\u0629",
      bravo: "\u0644\u0647\u0645",
      changeName: "\u0627\u0633\u0645 \u0627\u0644\u0641\u0631\u064A\u0642",
      deleteScore:
        "\u0627\u0645\u0633\u062D \u0627\u0644\u0645\u062C\u0645\u0648\u0639 \u0627\u0644\u0633\u0627\u0628\u0642",
      draw: "\u062A\u0639\u0627\u062F\u0644",
      lose: "\u062E\u0633\u0631",
      newGame: "\u0642\u064A\u0645 \u062C\u062F\u064A\u062F",
      super: "\u0633\u0648\u0628\u0631",
      win: "\u0641\u0627\u0632"
    }
  },
  language = "en",
  alpha = new Team(getText("alpha"), 0),
  bravo = new Team(getText("bravo"), 0);
function checkSuperState() {
  var a = !1,
    b = !1,
    c = "";
  if (alpha.isAbove2000() && bravo.isAbove2000() && alpha.score == bravo.score)
    (alphaStatus.innerText = getText("draw")),
      (bravoStatus.innerText = getText("draw")),
      (alphaStatus.className = "skew-20"),
      (bravoStatus.className = "skew-20");
  else if (alpha.isAbove2000() && alpha.score > bravo.score)
    declareWinner(alphaStatus, bravoStatus);
  else if (bravo.isAbove2000() && alpha.score < bravo.score)
    declareWinner(bravoStatus, alphaStatus);
  else {
    if (
      (alpha.isSuper()
        ? ((alphaStatus.innerText = getText("super")),
          (alphaStatus.className = "superState"),
          !0 == alphaFirstSuper &&
            ((alphaFirstSuper = !1), (c = "super"), (a = !0)))
        : ((alphaStatus.innerText = ""), (alphaStatus.className = "")),
      bravo.isSuper()
        ? ((bravoStatus.innerText = getText("super")),
          (bravoStatus.className = "superState"),
          !0 == bravoFirstSuper &&
            ((bravoFirstSuper = !1), (a = !0), (c = "super")))
        : ((bravoStatus.innerText = ""), (bravoStatus.className = "")),
      bravo.isSuper() && alpha.isSuper())
    )
      if (bravo.score == alpha.score) (b = !0), (a = !0);
      else {
        var d =
          Math.max(alpha.score, bravo.score) -
          Math.min(alpha.score, bravo.score);
        (b = 200 >= d && 0 < d), (a = !0);
      }
    b ? playSound("OMG") : a && playSound(c);
  }
}
function playSound(a) {
  if (!0 == document.getElementById("play").checked) {
    "super" == a
      ? (a = "super.mp3")
      : "OMG" == a
        ? (a = "omg.mp3")
        : "Victory" == a && (a = "");
    var b = new Audio("audio/" + a);
    (b.crossOrigin = "anonymous"), b.play();
  }
}
function revive() {
  var a = !1;
  localStorage.getItem("Alpha") &&
    (alpha.revive(JSON.parse(localStorage.getItem("Alpha"))), (a = !0)),
    localStorage.getItem("Bravo") &&
      (bravo.revive(JSON.parse(localStorage.getItem("Bravo"))), (a = !0)),
    localStorage.getItem("lang") && localStorage.getItem("sound")
      ? changeLanguage()
      : document
          .getElementById("drawer-toggle-label")
          .classList.add("glowAnimation"),
    a ? updateScoreBoards() : console.log("Nothing to revive");
}
revive(),
  updateTexts(),
  (alphaInput.placeholder = alpha.name),
  (bravoInput.placeholder = bravo.name);
function updateScoreBoards() {
  (alphaScoreBoard.innerHTML = alpha.ScoreBoardText),
    (bravoScoreBoard.innerHTML = bravo.ScoreBoardText),
    checkSuperState();
}
function changeName(a) {
  var b = prompt(
    translations[language].changeName,
    "( \u0361\xB0 \u035C\u0296 \u0361\xB0)"
  );
  null == b ||
    "" == b ||
    ("a" == a
      ? (alpha.changeName(b),
        (alphaName.innerText = alpha.name),
        (alphaInput.placeholder = alpha.name))
      : "b" == a &&
        (bravo.changeName(b),
        (bravoName.innerText = bravo.name),
        (bravoInput.placeholder = bravo.name))),
    persist();
}
function calculateScores() {
  alpha.addScore(alphaInput.value),
    bravo.addScore(bravoInput.value),
    updateScoreBoards(),
    (alphaInput.value = ""),
    (bravoInput.value = ""),
    persist();
}
function deletePreviousScore() {
  alpha.deleteLastScore(),
    bravo.deleteLastScore(),
    updateScoreBoards(),
    persist();
}
function newGame() {
  alpha.resetAllScores(),
    bravo.resetAllScores(),
    updateScoreBoards(),
    (alphaStatus.innerText = ""),
    (bravoStatus.innerText = "");
}
function updateTexts() {
  (document.getElementById("title").textContent = getText("appName")),
    (document.getElementById("newGameBtn").textContent = getText("newGame")),
    (document.getElementById("CalculateBtn").textContent = getText("addScore")),
    (document.getElementById("deleteBtn").textContent = getText("deleteScore")),
    updateScoreBoards();
}
function getText(a) {
  if (translations[language].hasOwnProperty(a))
    return translations[language][a];
}
function changeLanguage() {
  (language = !0 == document.getElementById("lang").checked ? "ar" : "en"),
    localStorage.setItem("lang", language),
    removeGlow(),
    updateTexts();
}
function toggleSounds() {
  localStorage.setItem("sound", document.getElementById("play").checked),
    removeGlow();
}
function removeGlow() {
  document
    .getElementById("drawer-toggle-label")
    .classList.remove("glowAnimation");
}
function declareWinner(a, b) {
  (a.innerText = getText("win")),
    a.classList.add("animation"),
    (a.style.color = "#006400"),
    (b.innerText = getText("lose")),
    (b.style.color = "red");
}
