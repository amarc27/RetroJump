var ctx;
var iFrame = 0;
var game = new IronDoodleGame();
var speed = 1.1;
var width = 400;
var height = 600;
var bouncingForce = 0.025*height;
var gravity = 0.001*height;
var intervalFrame = 20;
// var intervalFrame = 100;
var midScreen = height / 5;

var img = new Image();
img.src = 'Elon.png';




//JOUEUR
function Player(x, y, color, radius, vx, vy) {
  this.x = x;
  this.y = y;
  this.color = color;
  this.radius = radius;
  this.vx = vx;
  this.vy = vy;
  this.getRefY = function() {
    while (this.y + speed*iFrame < 100 + 3*this.radius)
      iFrame += 1;
    return this.y + speed*iFrame;
  }
  this.draw = function() {
    ctx.drawImage(img, this.x - this.radius, this.y - this.radius + speed*iFrame, 2*this.radius, 2*this.radius);

  }
  this.nextMove = function(platforms) {
    var isGoingToTouchAPlatform = false;
    var yPlateformGoingToBeTouched = undefined;
    for (var i = 0; i < platforms.length; i++) {
      if (this.y + this.radius < platforms[i].y &&
          this.y + this.radius + this.vy > platforms[i].y &&
          this.x > platforms[i].x &&
          this.x < platforms[i].x + platforms[i].width
          ) {
        // this.vx = 0;
        isGoingToTouchAPlatform = true;
        yPlateformGoingToBeTouched = platforms[i].y;
        console.log(platforms[i].power)
        if (platforms[i].power === "super-bouncing")
          this.vy = -2*bouncingForce;
        else if (platforms[i].power === "low-bouncing")
          this.vy = -bouncingForce/2;
        else
          this.vy = -bouncingForce;
      }
    }
    if (yPlateformGoingToBeTouched)
      this.y = yPlateformGoingToBeTouched-this.radius-1;
    else
      this.y += this.vy;
    this.vy += gravity;

    this.x += this.vx;
    this.vx *= 0.9
    this.vx = (this.vx)*(this.vx) < 0.1 ? 0: this.vx;
  }
}



//platform
function Platform(x, y, width, height, color, power) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.color = color;
  this.power = power;
  this.getRefY = function() {
    return this.y + speed*iFrame;
  }
  this.draw = function() {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y + speed*iFrame, this.width, this.height);
  }
}

function Score(x, y, color) {
  this.x = x;
  this.y = y;
  this.color = color;
  this.draw = function() {
    ctx.fillStyle = this.color;
    ctx.font = '16px sans-serif';
    ctx.fillText(Math.floor(iFrame), this.x, this.y);
  }
}

function HeadBar(x, y, width, height, color) {
  this.x = x;
  this.y= y;
  this.width = width;
  this.height = height;
  this.color = "color";
  this.draw = function() {
    ctx.fillStyle = "this.color";
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }
}



//GAME
function IronDoodleGame() {
}





IronDoodleGame.prototype.startGame = function() {
  var that = this
  ctx =  document.getElementById("canvas").getContext("2d");

  this.player = new Player(200, 180, "black", 25, 0, 1);
  this.platform1 = new Platform(150, 265, 100, 10, "black");
  this.platform2 = new Platform(150, 205, 100, 10, "black");
  this.platforms = [this.platform1, this.platform2];
  this.platforms.push(new Platform(150, 60, 100, 10, "black"))
  this.platforms.push(new Platform(250, 0, 100, 10, "black"))
  this.score = new Score(20, 30, "white");
  this.headBar = new HeadBar(0, 0, width, 45, "black");

  that = this
  plats.forEach(function (plt) {
    var topush = new Platform(plt.x, plt.y, plt.width, plt.height, plt.color, plt.power)
    that.platforms.push(topush)
  })


  this.myInterval = setInterval(function() {
    iFrame++;
    that.player.nextMove(that.platforms);
    that.drawEverything();
    that.checkIfGameOver();

    if (that.player.x > 400) {
      that.player.x = 0;
    }

    else if (that.player.x < 0) {
      that.player.x = 400;
    }

  }, intervalFrame);


  document.addEventListener('keydown', function (e) {
    const keyName = e.key;
    console.log('keydown event\n\n' + 'key: ' + keyName);
    switch (e.keyCode) {
      case 37:
        that.player.vx -= 5;
        break;
      case 39:
      that.player.vx += 5;
        break;
    }
  });

  document.getElementById("canvas").onclick = function(e) {
    var offsetWidth = document.getElementById("canvas").offsetWidth;
    // Move left
    if (e.offsetX < offsetWidth/2) {
      that.player.vx -= 5;
    }
    // Move right
    else {
      that.player.vx += 5;
    }
    console.log("click", e.offsetX)
  };


}

//GAME OVER
IronDoodleGame.prototype.checkIfGameOver = function() {
  if (this.player.getRefY() >= 600) {
    console.log("Game Over !");

    // Draw a black message
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, 400, 600);
    ctx.font = '38px sans-serif';
    ctx.fillStyle = "white";
    ctx.fillText("Game over !", 90, 200);
    clearInterval(this.myInterval);

    setScore(iFrame);
  }
}


//TOUT DESSINER
IronDoodleGame.prototype.drawEverything = function() {
  ctx.clearRect(0, 0, 400, 600);
  this.player.draw();
  for (var i = 0; i < this.platforms.length; i++) {
    this.platforms[i].draw();
  }
  this.headBar.draw();
  this.score.draw();

}


// Change the best score is the current score is better
function setScore (score) {
  var bestScore = localStorage.getItem("bestScore");
  if (score > bestScore)
    localStorage.setItem("bestScore", score);
}

function getBestScore() {
  var bestScore = localStorage.getItem("bestScore");
  if (!bestScore)
    bestScore = 0;
  return bestScore;
}

function resetBestScore() {
  localStorage.removeItem("bestScore");
}

function displayBestScore() {
  document.getElementById("best-score").innerHTML = getBestScore();
}

window.onload = function() {
  document.getElementById("start-button").onclick = function() {
    game.startGame();
  };

  displayBestScore();
}



var plats = [
  {
    "x": 269,
    "y": -2334,
    "width": 100,
    "height": 10,
    "color": "black"
  },
  {
    "x": 154,
    "y": -2799,
    "width": 100,
    "height": 10,
    "color": "black"
  },
  {
    "x": 114,
    "y": -248,
    "width": 100,
    "height": 10,
    "color": "black"
  },
  {
    "x": 165,
    "y": -3992,
    "width": 100,
    "height": 10,
    "color": "black"
  },
  {
    "x": 410,
    "y": -3238,
    "width": 100,
    "height": 10,
    "color": "black"
  },
  {
    "x": 191,
    "y": -2304,
    "width": 100,
    "height": 10,
    "color": "black"
  },
  {
    "x": 298,
    "y": -2246,
    "width": 100,
    "height": 10,
    "color": "black"
  },
  {
    "x": 171,
    "y": -2057,
    "width": 100,
    "height": 10,
    "color": "black"
  },
  {
    "x": 384,
    "y": -1399,
    "width": 100,
    "height": 10,
    "color": "black"
  },
  {
    "x": 314,
    "y": -1283,
    "width": 100,
    "height": 10,
    "color": "black"
  },
  {
    "x": 213,
    "y": -3791,
    "width": 100,
    "color": "green",
    "power": "super-bouncing"
  },
  {
    "x": 440,
    "y": -3091,
    "width": 100,
    "height": 10,
    "color": "red",
    "power": "low-bouncing"
  },
  {
    "x": 213,
    "y": -1856,
    "width": 100,
    "color": "red",
    "power": "low-bouncing"
  },
  {
    "x": 227,
    "y": -2358,
    "width": 100,
    "color": "red",
    "power": "low-bouncing"
  },
  {
    "x": 397,
    "y": -319,
    "width": 100,
    "height": 10,
    "color": "black"
  },
  {
    "x": 32,
    "y": -2245,
    "width": 100,
    "height": 10,
    "color": "black"
  },
  {
    "x": 169,
    "y": -235,
    "width": 100,
    "height": 10,
    "color": "black"
  },
  {
    "x": 316,
    "y": -857,
    "width": 100,
    "height": 10,
    "color": "black"
  },
  {
    "x": 247,
    "y": -3300,
    "width": 100,
    "height": 10,
    "color": "black"
  },
  {
    "x": 223,
    "y": -696,
    "width": 100,
    "height": 10,
    "color": "black"
  },
  {
    "x": 437,
    "y": -2930,
    "width": 100,
    "height": 10,
    "color": "black"
  },
  {
    "x": 281,
    "y": -466,
    "width": 100,
    "height": 10,
    "color": "black"
  },
  {
    "x": 380,
    "y": -3709,
    "width": 100,
    "height": 10,
    "color": "black"
  },
  {
    "x": 433,
    "y": -1661,
    "width": 100,
    "height": 10,
    "color": "black"
  },
  {
    "x": 48,
    "y": -1816,
    "width": 100,
    "height": 10,
    "color": "black"
  },
  {
    "x": 301,
    "y": -770,
    "width": 100,
    "height": 10,
    "color": "black"
  },
  {
    "x": 102,
    "y": -47,
    "width": 100,
    "height": 10,
    "color": "black"
  },
  {
    "x": 445,
    "y": -872,
    "width": 100,
    "height": 10,
    "color": "black"
  },
  {
    "x": 38,
    "y": -1604,
    "width": 100,
    "height": 10,
    "color": "black"
  },
  {
    "x": 462,
    "y": -3838,
    "width": 100,
    "height": 10,
    "color": "black"
  },
  {
    "x": 14,
    "y": -868,
    "width": 100,
    "height": 10,
    "color": "black"
  },
  {
    "x": 137,
    "y": -2013,
    "width": 100,
    "height": 10,
    "color": "black"
  },
  {
    "x": 51,
    "y": -1278,
    "width": 100,
    "height": 10,
    "color": "black"
  },
  {
    "x": 229,
    "y": -3747,
    "width": 100,
    "height": 10,
    "color": "black"
  },
  {
    "x": 328,
    "y": -1211,
    "width": 100,
    "height": 10,
    "color": "black"
  },
  {
    "x": 328,
    "y": -2010,
    "width": 100,
    "height": 10,
    "color": "black"
  },
  {
    "x": 437,
    "y": -187,
    "width": 100,
    "height": 10,
    "color": "black"
  },
  {
    "x": 36,
    "y": -745,
    "width": 100,
    "height": 10,
    "color": "black"
  },
  {
    "x": 159,
    "y": -2088,
    "width": 100,
    "height": 10,
    "color": "black"
  },
  {
    "x": 401,
    "y": -2486,
    "width": 100,
    "height": 10,
    "color": "black"
  },
  {
    "x": 129,
    "y": -2119,
    "width": 100,
    "height": 10,
    "color": "black"
  },
  {
    "x": 185,
    "y": -560,
    "width": 100,
    "height": 10,
    "color": "black"
  },
  {
    "x": 420,
    "y": -3166,
    "width": 100,
    "height": 10,
    "color": "black"
  },
  {
    "x": 280,
    "y": -254,
    "width": 100,
    "height": 10,
    "color": "black"
  },
  {
    "x": 388,
    "y": -2457,
    "width": 100,
    "height": 10,
    "color": "black"
  },
  {
    "x": 462,
    "y": -861,
    "width": 100,
    "height": 10,
    "color": "black"
  },
  {
    "x": 9,
    "y": -3983,
    "width": 100,
    "height": 10,
    "color": "black"
  },
  {
    "x": 265,
    "y": -2966,
    "width": 100,
    "height": 10,
    "color": "black"
  },
  {
    "x": 285,
    "y": -2054,
    "width": 100,
    "height": 10,
    "color": "black"
  },
  {
    "x": 376,
    "y": -44,
    "width": 100,
    "height": 10,
    "color": "black"
  },
  {
    "x": 13,
    "y": -1417,
    "width": 100,
    "height": 10,
    "color": "black"
  },
  {
    "x": 130,
    "y": -2039,
    "width": 100,
    "height": 10,
    "color": "black"
  },
  {
    "x": 20,
    "y": -2293,
    "width": 100,
    "height": 10,
    "color": "black"
  },
  {
    "x": 359,
    "y": -71,
    "width": 100,
    "height": 10,
    "color": "black"
  },
  {
    "x": 41,
    "y": -286,
    "width": 100,
    "height": 10,
    "color": "black"
  },
  {
    "x": 255,
    "y": -3220,
    "width": 100,
    "height": 10,
    "color": "black"
  },
  {
    "x": 231,
    "y": -753,
    "width": 100,
    "height": 10,
    "color": "black"
  },
  {
    "x": 210,
    "y": -1617,
    "width": 100,
    "height": 10,
    "color": "black"
  },
  {
    "x": 13,
    "y": -2656,
    "width": 100,
    "height": 10,
    "color": "black"
  },
  {
    "x": 95,
    "y": -151,
    "width": 100,
    "height": 10,
    "color": "black"
  },
  {
    "x": 191,
    "y": -1925,
    "width": 100,
    "height": 10,
    "color": "black"
  },
  {
    "x": 337,
    "y": -1608,
    "width": 100,
    "height": 10,
    "color": "black"
  },
  {
    "x": 130,
    "y": -331,
    "width": 100,
    "height": 10,
    "color": "black"
  },
  {
    "x": 182,
    "y": -2206,
    "width": 100,
    "height": 10,
    "color": "black"
  },
  {
    "x": 291,
    "y": -3056,
    "width": 100,
    "height": 10,
    "color": "black"
  },
  {
    "x": 299,
    "y": -2592,
    "width": 100,
    "height": 10,
    "color": "black"
  },
  {
    "x": 304,
    "y": -2219,
    "width": 100,
    "height": 10,
    "color": "black"
  },
  {
    "x": 193,
    "y": -3382,
    "width": 100,
    "height": 10,
    "color": "black"
  },
  {
    "x": 488,
    "y": -3218,
    "width": 100,
    "height": 10,
    "color": "black"
  },
  {
    "x": 84,
    "y": -720,
    "width": 100,
    "height": 10,
    "color": "black"
  },
  {
    "x": 207,
    "y": -530,
    "width": 100,
    "height": 10,
    "color": "black"
  },
  {
    "x": 464,
    "y": -199,
    "width": 100,
    "height": 10,
    "color": "black"
  },
  {
    "x": 230,
    "y": -1996,
    "width": 100,
    "height": 10,
    "color": "black"
  },
  {
    "x": 72,
    "y": -3930,
    "width": 100,
    "height": 10,
    "color": "black"
  },
  {
    "x": 439,
    "y": -2553,
    "width": 100,
    "height": 10,
    "color": "black"
  },
  {
    "x": 287,
    "y": -3738,
    "width": 100,
    "height": 10,
    "color": "black"
  },
  {
    "x": 299,
    "y": -35,
    "width": 100,
    "height": 10,
    "color": "black"
  },
  {
    "x": 106,
    "y": 4,
    "width": 100,
    "height": 10,
    "color": "black"
  },
  {
    "x": 33,
    "y": -3847,
    "width": 100,
    "height": 10,
    "color": "black"
  },
  {
    "x": 329,
    "y": -1963,
    "width": 100,
    "height": 10,
    "color": "black"
  },
  {
    "x": 426,
    "y": -3268,
    "width": 100,
    "height": 10,
    "color": "black"
  },
  {
    "x": 348,
    "y": -3724,
    "width": 100,
    "height": 10,
    "color": "black"
  },
  {
    "x": 307,
    "y": -2705,
    "width": 100,
    "height": 10,
    "color": "black"
  },
  {
    "x": 16,
    "y": -2025,
    "width": 100,
    "height": 10,
    "color": "black"
  },
  {
    "x": 487,
    "y": -897,
    "width": 100,
    "height": 10,
    "color": "black"
  },
  {
    "x": 398,
    "y": -822,
    "width": 100,
    "height": 10,
    "color": "black"
  },
  {
    "x": 241,
    "y": -641,
    "width": 100,
    "height": 10,
    "color": "black"
  },
  {
    "x": 298,
    "y": -555,
    "width": 100,
    "height": 10,
    "color": "black"
  },
  {
    "x": 379,
    "y": -3566,
    "width": 100,
    "height": 10,
    "color": "black"
  },
  {
    "x": 330,
    "y": -1155,
    "width": 100,
    "height": 10,
    "color": "black"
  },
  {
    "x": 99,
    "y": -2544,
    "width": 100,
    "height": 10,
    "color": "black"
  },
  {
    "x": 390,
    "y": -1614,
    "width": 100,
    "height": 10,
    "color": "black"
  },
  {
    "x": 400,
    "y": -3095,
    "width": 100,
    "height": 10,
    "color": "black"
  },
  {
    "x": 107,
    "y": -1366,
    "width": 100,
    "height": 10,
    "color": "black"
  },
  {
    "x": 46,
    "y": -2835,
    "width": 100,
    "height": 10,
    "color": "black"
  },
  {
    "x": 94,
    "y": -2651,
    "width": 100,
    "height": 10,
    "color": "black"
  },
  {
    "x": 403,
    "y": -3673,
    "width": 100,
    "height": 10,
    "color": "black"
  },
  {
    "x": 299,
    "y": -490,
    "width": 100,
    "height": 10,
    "color": "black"
  },
  {
    "x": 243,
    "y": -2043,
    "width": 100,
    "height": 10,
    "color": "black"
  },
  {
    "x": 119,
    "y": -858,
    "width": 100,
    "height": 10,
    "color": "black"
  },
  {
    "x": 357,
    "y": -2966,
    "width": 100,
    "height": 10,
    "color": "black"
  },
  {
    "x": 394,
    "y": -456,
    "width": 100,
    "height": 10,
    "color": "black"
  },
  {
    "x": 85,
    "y": -1017,
    "width": 100,
    "height": 10,
    "color": "black"
  },
  {
    "x": 260,
    "y": -716,
    "width": 100,
    "height": 10,
    "color": "black"
  },
  {
    "x": 463,
    "y": -2095,
    "width": 100,
    "height": 10,
    "color": "black"
  },
  {
    "x": 250,
    "y": -728,
    "width": 100,
    "height": 10,
    "color": "black"
  },
  {
    "x": 262,
    "y": -2207,
    "width": 100,
    "height": 10,
    "color": "black"
  },
  {
    "x": 495,
    "y": -1026,
    "width": 100,
    "height": 10,
    "color": "black"
  },
  {
    "x": 411,
    "y": -827,
    "width": 100,
    "height": 10,
    "color": "black"
  },
  {
    "x": 144,
    "y": -1520,
    "width": 100,
    "height": 10,
    "color": "black"
  },
  {
    "x": 457,
    "y": -1183,
    "width": 100,
    "height": 10,
    "color": "black"
  },
  {
    "x": 51,
    "y": -2682,
    "width": 100,
    "height": 10,
    "color": "black"
  },
  {
    "x": 206,
    "y": -1386,
    "width": 100,
    "height": 10,
    "color": "black"
  },
  {
    "x": 132,
    "y": -3224,
    "width": 100,
    "height": 10,
    "color": "black"
  },
  {
    "x": 272,
    "y": -1937,
    "width": 100,
    "height": 10,
    "color": "black"
  },
  {
    "x": 54,
    "y": -2908,
    "width": 100,
    "height": 10,
    "color": "black"
  },
  {
    "x": 110,
    "y": -903,
    "width": 100,
    "height": 10,
    "color": "black"
  },
  {
    "x": 446,
    "y": -3900,
    "width": 100,
    "height": 10,
    "color": "black"
  },
  {
    "x": 437,
    "y": -1118,
    "width": 100,
    "height": 10,
    "color": "black"
  },
  {
    "x": 237,
    "y": -1174,
    "width": 100,
    "height": 10,
    "color": "black"
  },
  {
    "x": 28,
    "y": -1414,
    "width": 100,
    "height": 10,
    "color": "black"
  },
  {
    "x": 148,
    "y": -3807,
    "width": 100,
    "height": 10,
    "color": "black"
  },
  {
    "x": 234,
    "y": -822,
    "width": 100,
    "height": 10,
    "color": "black"
  },
  {
    "x": 192,
    "y": -907,
    "width": 100,
    "height": 10,
    "color": "black"
  },
  {
    "x": 467,
    "y": -2834,
    "width": 100,
    "height": 10,
    "color": "black"
  },
  {
    "x": 299,
    "y": -3350,
    "width": 100,
    "height": 10,
    "color": "black"
  },
  {
    "x": 42,
    "y": -3572,
    "width": 100,
    "height": 10,
    "color": "black"
  },
  {
    "x": 383,
    "y": -3229,
    "width": 100,
    "height": 10,
    "color": "black"
  },
  {
    "x": 452,
    "y": -3818,
    "width": 100,
    "height": 10,
    "color": "black"
  }
]
