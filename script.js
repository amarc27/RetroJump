var ctx;
var iFrame = 0;
var game = new IronDoodleGame();
var speed = 1.1;
var width = 400;
var height = 600;
var bouncingForce = 0.025*height;
var gravity = 0.001*height;
var intervalFrame = 20;
var midScreen = height / 5;
var img = new Image();
img.src = 'Elon.png';
var bgimg = new Image();
bgimg.src = "Space1.jpg";
var bestScore = 0;


//JOUEUR
function Player(x, y, color, radius, vx, vy) {
  this.x = x;
  this.y = y;
  this.color = color;
  this.radius = radius;
  this.vx = vx;
  this.vy = vy;
  this.getRefY = function() {
    while (this.y + speed*iFrame < 100 + 3*this.radius) {
      iFrame += 1;
    }
    return this.y + speed*iFrame;
  }
  this.draw = function() {
    ctx.drawImage(img, this.x - this.radius, this.y - this.radius + speed*iFrame, 2*this.radius, 2*this.radius);
  }
  this.nextMove = function(platforms) {
    for (var i = 0; i < platforms.length; i++) {
      if (this.y + this.radius < platforms[i].y &&
          this.y + this.radius + this.vy > platforms[i].y &&
          this.x > platforms[i].x &&
          this.x < platforms[i].x + platforms[i].width
          ) {
          if (platforms[i].power === "super-bouncing")
             this.vy = -2*bouncingForce;
          else if (platforms[i].power === "low-bouncing")
             this.vy = -bouncingForce/2;
          else if (platforms[i].power === "toNextLevel")
             this.vy = -4.7*bouncingForce;
          else
             this.vy = -bouncingForce;
      }
    }
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
    if (this.power === "toNextLevel") {
      ctx.font = '18px sans-serif';
      ctx.fillStyle = "white";
      ctx.fillText("TO NEXT LEVEL", 140, -25 + speed * iFrame);
    }
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
  this.color = color;
  this.draw = function() {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }
}



//GAME
function IronDoodleGame() {

}




IronDoodleGame.prototype.startGame = function() {
  var that = this
  ctx =  document.getElementById("canvas").getContext("2d");

  this.player = new Player(200, 180, "white", 25, 0, 1);
  this.platform1 = new Platform(150, 265, 100, 10, "white");
  this.platform2 = new Platform(150, 205, 100, 10, "white");
  this.platforms = [this.platform1, this.platform2];
  this.platforms.push(new Platform(150, 60, 100, 10, "white"))
  this.platforms.push(new Platform(250, 0, 100, 10, "white"))
  this.score = new Score(20, 30, "white");
  this.headBar = new HeadBar(0, 0, width, 45, "black");

  that = this
  plats.forEach(function (plt) {
    var topush = new Platform(plt.x, plt.y, plt.width, plt.height, plt.color, plt.power)
    that.platforms.push(topush)
  });


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


  this.drawBackground = function() {
    var bgy = 0.5*iFrame%height-height;
    ctx.drawImage(bgimg, 0, bgy, width, height);
    ctx.drawImage(bgimg, 0, bgy + height, width, height);
  }
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
  this.drawBackground();

  for (var i = 0; i < this.platforms.length; i++) {
    this.platforms[i].draw();
  }
  if (bestScore >= 4000) {
    this.platforms.push(new Platform(0, -47 + speed * iFrame, 1000, 30, "blue", "toNextLevel"))
    bestScore = 0
  }

  this.player.draw();

  this.headBar.draw();
  this.score.draw();
}


// Change the best score is the current score is better
function setScore (score) {
  bestScore = localStorage.getItem("bestScore");
  if (score > bestScore)
    localStorage.setItem("bestScore", score);
}

function getBestScore() {
  bestScore = localStorage.getItem("bestScore");
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
    "color": "white"
  },
  {
    "x": 154,
    "y": -2799,
    "width": 100,
    "height": 10,
    "color": "white"
  },
  {
    "x": 114,
    "y": -248,
    "width": 100,
    "height": 10,
    "color": "white"
  },
  {
    "x": 165,
    "y": -3992,
    "width": 100,
    "height": 10,
    "color": "white"
  },
  {
    "x": 410,
    "y": -3238,
    "width": 100,
    "height": 10,
    "color": "white"
  },
  {
    "x": 191,
    "y": -2304,
    "width": 100,
    "height": 10,
    "color": "white"
  },
  {
    "x": 298,
    "y": -2246,
    "width": 100,
    "height": 10,
    "color": "white"
  },
  {
    "x": 171,
    "y": -2057,
    "width": 100,
    "height": 10,
    "color": "white"
  },
  {
    "x": 384,
    "y": -1399,
    "width": 100,
    "height": 10,
    "color": "white"
  },
  {
    "x": 314,
    "y": -1283,
    "width": 100,
    "height": 10,
    "color": "white"
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
    "color": "white"
  },
  {
    "x": 32,
    "y": -2245,
    "width": 100,
    "height": 10,
    "color": "white"
  },
  {
    "x": 169,
    "y": -235,
    "width": 100,
    "height": 10,
    "color": "white"
  },
  {
    "x": 316,
    "y": -857,
    "width": 100,
    "height": 10,
    "color": "white"
  },
  {
    "x": 247,
    "y": -3300,
    "width": 100,
    "height": 10,
    "color": "white"
  },
  {
    "x": 223,
    "y": -696,
    "width": 100,
    "height": 10,
    "color": "white"
  },
  {
    "x": 437,
    "y": -2930,
    "width": 100,
    "height": 10,
    "color": "white"
  },
  {
    "x": 281,
    "y": -466,
    "width": 100,
    "height": 10,
    "color": "white"
  },
  {
    "x": 380,
    "y": -3709,
    "width": 100,
    "height": 10,
    "color": "white"
  },
  {
    "x": 433,
    "y": -1661,
    "width": 100,
    "height": 10,
    "color": "white"
  },
  {
    "x": 48,
    "y": -1816,
    "width": 100,
    "height": 10,
    "color": "white"
  },
  {
    "x": 301,
    "y": -770,
    "width": 100,
    "height": 10,
    "color": "white"
  },
  // {
  //   "x": 100,
  //   "y": -47,
  //   "width": 250,
  //   "height": 40,
  //   "color": "red",
  //   "power": "toNextLevel"
  // },
  {
    "x": 445,
    "y": -872,
    "width": 100,
    "height": 10,
    "color": "white"
  },
  {
    "x": 38,
    "y": -1604,
    "width": 100,
    "height": 10,
    "color": "white"
  },
  {
    "x": 462,
    "y": -3838,
    "width": 100,
    "height": 10,
    "color": "white"
  },
  {
    "x": 14,
    "y": -868,
    "width": 100,
    "height": 10,
    "color": "white"
  },
  {
    "x": 137,
    "y": -2013,
    "width": 100,
    "height": 10,
    "color": "white"
  },
  {
    "x": 51,
    "y": -1278,
    "width": 100,
    "height": 10,
    "color": "white"
  },
  {
    "x": 229,
    "y": -3747,
    "width": 100,
    "height": 10,
    "color": "white"
  },
  {
    "x": 328,
    "y": -1211,
    "width": 100,
    "height": 10,
    "color": "white"
  },
  {
    "x": 328,
    "y": -2010,
    "width": 100,
    "height": 10,
    "color": "white"
  },
  {
    "x": 437,
    "y": -187,
    "width": 100,
    "height": 10,
    "color": "white"
  },
  {
    "x": 36,
    "y": -745,
    "width": 100,
    "height": 10,
    "color": "white"
  },
  {
    "x": 159,
    "y": -2088,
    "width": 100,
    "height": 10,
    "color": "white"
  },
  {
    "x": 401,
    "y": -2486,
    "width": 100,
    "height": 10,
    "color": "white"
  },
  {
    "x": 129,
    "y": -2119,
    "width": 100,
    "height": 10,
    "color": "white"
  },
  {
    "x": 185,
    "y": -560,
    "width": 100,
    "height": 10,
    "color": "white"
  },
  {
    "x": 420,
    "y": -3166,
    "width": 100,
    "height": 10,
    "color": "white"
  },
  {
    "x": 280,
    "y": -254,
    "width": 100,
    "height": 10,
    "color": "white"
  },
  {
    "x": 388,
    "y": -2457,
    "width": 100,
    "height": 10,
    "color": "white"
  },
  {
    "x": 462,
    "y": -861,
    "width": 100,
    "height": 10,
    "color": "white"
  },
  {
    "x": 9,
    "y": -3983,
    "width": 100,
    "height": 10,
    "color": "white"
  },
  {
    "x": 265,
    "y": -2966,
    "width": 100,
    "height": 10,
    "color": "white"
  },
  {
    "x": 285,
    "y": -2054,
    "width": 100,
    "height": 10,
    "color": "white"
  },
  {
    "x": 476,
    "y": 4,
    "width": 100,
    "height": 10,
    "color": "white"
  },
  {
    "x": 13,
    "y": -1417,
    "width": 100,
    "height": 10,
    "color": "white"
  },
  {
    "x": 130,
    "y": -2039,
    "width": 100,
    "height": 10,
    "color": "white"
  },
  {
    "x": 20,
    "y": -2293,
    "width": 100,
    "height": 10,
    "color": "white"
  },
  {
    "x": 359,
    "y": -71,
    "width": 100,
    "height": 10,
    "color": "white"
  },
  {
    "x": 41,
    "y": -286,
    "width": 100,
    "height": 10,
    "color": "white"
  },
  {
    "x": 255,
    "y": -3220,
    "width": 100,
    "height": 10,
    "color": "white"
  },
  {
    "x": 231,
    "y": -753,
    "width": 100,
    "height": 10,
    "color": "white"
  },
  {
    "x": 210,
    "y": -1617,
    "width": 100,
    "height": 10,
    "color": "white"
  },
  {
    "x": 13,
    "y": -2656,
    "width": 100,
    "height": 10,
    "color": "white"
  },
  {
    "x": 95,
    "y": -151,
    "width": 100,
    "height": 10,
    "color": "white"
  },
  {
    "x": 191,
    "y": -1925,
    "width": 100,
    "height": 10,
    "color": "white"
  },
  {
    "x": 337,
    "y": -1608,
    "width": 100,
    "height": 10,
    "color": "white"
  },
  {
    "x": 130,
    "y": -331,
    "width": 100,
    "height": 10,
    "color": "white"
  },
  {
    "x": 182,
    "y": -2206,
    "width": 100,
    "height": 10,
    "color": "white"
  },
  {
    "x": 291,
    "y": -3056,
    "width": 100,
    "height": 10,
    "color": "white"
  },
  {
    "x": 299,
    "y": -2592,
    "width": 100,
    "height": 10,
    "color": "white"
  },
  {
    "x": 304,
    "y": -2219,
    "width": 100,
    "height": 10,
    "color": "white"
  },
  {
    "x": 193,
    "y": -3382,
    "width": 100,
    "height": 10,
    "color": "white"
  },
  {
    "x": 488,
    "y": -3218,
    "width": 100,
    "height": 10,
    "color": "white"
  },
  {
    "x": 84,
    "y": -720,
    "width": 100,
    "height": 10,
    "color": "white"
  },
  {
    "x": 207,
    "y": -530,
    "width": 100,
    "height": 10,
    "color": "white"
  },
  {
    "x": 464,
    "y": -199,
    "width": 100,
    "height": 10,
    "color": "white"
  },
  {
    "x": 230,
    "y": -1996,
    "width": 100,
    "height": 10,
    "color": "white"
  },
  {
    "x": 72,
    "y": -3930,
    "width": 100,
    "height": 10,
    "color": "white"
  },
  {
    "x": 439,
    "y": -2553,
    "width": 100,
    "height": 10,
    "color": "white"
  },
  {
    "x": 287,
    "y": -3738,
    "width": 100,
    "height": 10,
    "color": "white"
  },
  {
    "x": 299,
    "y": -35,
    "width": 100,
    "height": 10,
    "color": "white"
  },
  {
    "x": 106,
    "y": 4,
    "width": 100,
    "height": 10,
    "color": "white"
  },
  {
    "x": 33,
    "y": -3847,
    "width": 100,
    "height": 10,
    "color": "white"
  },
  {
    "x": 329,
    "y": -1963,
    "width": 100,
    "height": 10,
    "color": "white"
  },
  {
    "x": 426,
    "y": -3268,
    "width": 100,
    "height": 10,
    "color": "white"
  },
  {
    "x": 348,
    "y": -3724,
    "width": 100,
    "height": 10,
    "color": "white"
  },
  {
    "x": 307,
    "y": -2705,
    "width": 100,
    "height": 10,
    "color": "white"
  },
  {
    "x": 16,
    "y": -2025,
    "width": 100,
    "height": 10,
    "color": "white"
  },
  {
    "x": 487,
    "y": -897,
    "width": 100,
    "height": 10,
    "color": "white"
  },
  {
    "x": 398,
    "y": -822,
    "width": 100,
    "height": 10,
    "color": "white"
  },
  {
    "x": 241,
    "y": -641,
    "width": 100,
    "height": 10,
    "color": "white"
  },
  {
    "x": 298,
    "y": -555,
    "width": 100,
    "height": 10,
    "color": "white"
  },
  {
    "x": 379,
    "y": -3566,
    "width": 100,
    "height": 10,
    "color": "white"
  },
  {
    "x": 330,
    "y": -1155,
    "width": 100,
    "height": 10,
    "color": "white"
  },
  {
    "x": 99,
    "y": -2544,
    "width": 100,
    "height": 10,
    "color": "white"
  },
  {
    "x": 390,
    "y": -1614,
    "width": 100,
    "height": 10,
    "color": "white"
  },
  {
    "x": 400,
    "y": -3095,
    "width": 100,
    "height": 10,
    "color": "white"
  },
  {
    "x": 107,
    "y": -1366,
    "width": 100,
    "height": 10,
    "color": "white"
  },
  {
    "x": 46,
    "y": -2835,
    "width": 100,
    "height": 10,
    "color": "white"
  },
  {
    "x": 94,
    "y": -2651,
    "width": 100,
    "height": 10,
    "color": "white"
  },
  {
    "x": 403,
    "y": -3673,
    "width": 100,
    "height": 10,
    "color": "white"
  },
  {
    "x": 299,
    "y": -490,
    "width": 100,
    "height": 10,
    "color": "white"
  },
  {
    "x": 243,
    "y": -2043,
    "width": 100,
    "height": 10,
    "color": "white"
  },
  {
    "x": 119,
    "y": -858,
    "width": 100,
    "height": 10,
    "color": "white"
  },
  {
    "x": 357,
    "y": -2966,
    "width": 100,
    "height": 10,
    "color": "white"
  },
  {
    "x": 394,
    "y": -456,
    "width": 100,
    "height": 10,
    "color": "white"
  },
  {
    "x": 85,
    "y": -1017,
    "width": 100,
    "height": 10,
    "color": "white"
  },
  {
    "x": 260,
    "y": -716,
    "width": 100,
    "height": 10,
    "color": "white"
  },
  {
    "x": 463,
    "y": -2095,
    "width": 100,
    "height": 10,
    "color": "white"
  },
  {
    "x": 250,
    "y": -728,
    "width": 100,
    "height": 10,
    "color": "white"
  },
  {
    "x": 262,
    "y": -2207,
    "width": 100,
    "height": 10,
    "color": "white"
  },
  {
    "x": 495,
    "y": -1026,
    "width": 100,
    "height": 10,
    "color": "white"
  },
  {
    "x": 411,
    "y": -827,
    "width": 100,
    "height": 10,
    "color": "white"
  },
  {
    "x": 144,
    "y": -1520,
    "width": 100,
    "height": 10,
    "color": "white"
  },
  {
    "x": 457,
    "y": -1183,
    "width": 100,
    "height": 10,
    "color": "white"
  },
  {
    "x": 51,
    "y": -2682,
    "width": 100,
    "height": 10,
    "color": "white"
  },
  {
    "x": 206,
    "y": -1386,
    "width": 100,
    "height": 10,
    "color": "white"
  },
  {
    "x": 132,
    "y": -3224,
    "width": 100,
    "height": 10,
    "color": "white"
  },
  {
    "x": 272,
    "y": -1937,
    "width": 100,
    "height": 10,
    "color": "white"
  },
  {
    "x": 54,
    "y": -2908,
    "width": 100,
    "height": 10,
    "color": "white"
  },
  {
    "x": 110,
    "y": -903,
    "width": 100,
    "height": 10,
    "color": "white"
  },
  {
    "x": 446,
    "y": -3900,
    "width": 100,
    "height": 10,
    "color": "white"
  },
  {
    "x": 437,
    "y": -1118,
    "width": 100,
    "height": 10,
    "color": "white"
  },
  {
    "x": 237,
    "y": -1174,
    "width": 100,
    "height": 10,
    "color": "white"
  },
  {
    "x": 28,
    "y": -1414,
    "width": 100,
    "height": 10,
    "color": "white"
  },
  {
    "x": 148,
    "y": -3807,
    "width": 100,
    "height": 10,
    "color": "white"
  },
  {
    "x": 234,
    "y": -822,
    "width": 100,
    "height": 10,
    "color": "white"
  },
  {
    "x": 192,
    "y": -907,
    "width": 100,
    "height": 10,
    "color": "white"
  },
  {
    "x": 467,
    "y": -2834,
    "width": 100,
    "height": 10,
    "color": "white"
  },
  {
    "x": 299,
    "y": -3350,
    "width": 100,
    "height": 10,
    "color": "white"
  },
  {
    "x": 42,
    "y": -3572,
    "width": 100,
    "height": 10,
    "color": "white"
  },
  {
    "x": 383,
    "y": -3229,
    "width": 100,
    "height": 10,
    "color": "white"
  },
  {
    "x": 452,
    "y": -3818,
    "width": 100,
    "height": 10,
    "color": "white"
  },
  {
    "x": 452,
    "y": -3818,
    "width": 100,
    "height": 10,
    "color": "white"
  },


//NIVEAU 2

  // {
  //   "x": 150,
  //   "y": -4010,
  //   "width": 600,
  //   "height": 30,
  //   "color": "red"
  // },
  {
    "x": 472,
    "y": -6494,
    "width": 100,
    "height": 10,
    "color": "white"
  },
  {
    "x": 12,
    "y": -4846,
    "width": 100,
    "height": 10,
    "color": "white"
  },
  {
    "x": 319,
    "y": -4092,
    "width": 100,
    "height": 10,
    "color": "white"
  },
  {
    "x": 187,
    "y": -6446,
    "width": 100,
    "height": 10,
    "color": "white"
  },
  {
    "x": 112,
    "y": -4675,
    "width": 100,
    "height": 10,
    "color": "white"
  },
  {
    "x": 181,
    "y": -7740,
    "width": 100,
    "height": 10,
    "color": "white"
  },
  {
    "x": 218,
    "y": -5473,
    "width": 100,
    "height": 10,
    "color": "white"
  },
  {
    "x": 25,
    "y": -7325,
    "width": 100,
    "height": 10,
    "color": "white"
  },
  {
    "x": 321,
    "y": -5317,
    "width": 100,
    "height": 10,
    "color": "white"
  },
  {
    "x": 126,
    "y": -5826,
    "width": 100,
    "height": 10,
    "color": "white"
  },
  {
    "x": 195,
    "y": -4591,
    "width": 100,
    "height": 10,
    "color": "white"
  },
  {
    "x": 465,
    "y": -7905,
    "width": 100,
    "height": 10,
    "color": "white"
  },
  {
    "x": 250,
    "y": -7492,
    "width": 100,
    "height": 10,
    "color": "white"
  },
  {
    "x": 325,
    "y": -6103,
    "width": 100,
    "height": 10,
    "color": "white"
  },
  {
    "x": 119,
    "y": -5057,
    "width": 100,
    "height": 10,
    "color": "white"
  },
  {
    "x": 199,
    "y": -4048,
    "width": 100,
    "height": 10,
    "color": "white"
  },
  {
    "x": 118,
    "y": -4625,
    "width": 100,
    "height": 10,
    "color": "white"
  },
  {
    "x": 367,
    "y": -7253,
    "width": 100,
    "height": 10,
    "color": "white"
  },
  {
    "x": 250,
    "y": -6007,
    "width": 100,
    "height": 10,
    "color": "white"
  },
  {
    "x": 198,
    "y": -5409,
    "width": 100,
    "height": 10,
    "color": "white"
  },
  {
    "x": 296,
    "y": -4926,
    "width": 100,
    "height": 10,
    "color": "white"
  },
  {
    "x": 179,
    "y": -4542,
    "width": 100,
    "height": 10,
    "color": "white"
  },
  {
    "x": 485,
    "y": -5846,
    "width": 100,
    "height": 10,
    "color": "white"
  },
  {
    "x": 136,
    "y": -6081,
    "width": 100,
    "height": 10,
    "color": "white"
  },
  {
    "x": 301,
    "y": -7502,
    "width": 100,
    "height": 10,
    "color": "white"
  },
  {
    "x": 282,
    "y": -7099,
    "width": 100,
    "height": 10,
    "color": "white"
  },
  {
    "x": 105,
    "y": -7581,
    "width": 100,
    "height": 10,
    "color": "white"
  },
  {
    "x": 335,
    "y": -6989,
    "width": 100,
    "height": 10,
    "color": "white"
  },
  {
    "x": 46,
    "y": -7290,
    "width": 100,
    "height": 10,
    "color": "white"
  },
  {
    "x": 179,
    "y": -4468,
    "width": 100,
    "height": 10,
    "color": "white"
  },
  {
    "x": 116,
    "y": -5457,
    "width": 100,
    "height": 10,
    "color": "white"
  },
  {
    "x": 213,
    "y": -5489,
    "width": 100,
    "height": 10,
    "color": "white"
  },
  {
    "x": 351,
    "y": -5074,
    "width": 100,
    "height": 10,
    "color": "white"
  },
  {
    "x": 19,
    "y": -7213,
    "width": 100,
    "height": 10,
    "color": "white"
  },
  {
    "x": 63,
    "y": -6964,
    "width": 100,
    "height": 10,
    "color": "white"
  },
  {
    "x": 37,
    "y": -6705,
    "width": 100,
    "height": 10,
    "color": "white"
  },
  {
    "x": 212,
    "y": -5200,
    "width": 100,
    "height": 10,
    "color": "white"
  },
  {
    "x": 8,
    "y": -4881,
    "width": 100,
    "height": 10,
    "color": "white"
  },
  {
    "x": 143,
    "y": -4049,
    "width": 100,
    "height": 10,
    "color": "white"
  },
  {
    "x": 11,
    "y": -6178,
    "width": 100,
    "height": 10,
    "color": "white"
  },
  {
    "x": 75,
    "y": -4339,
    "width": 100,
    "height": 10,
    "color": "white"
  },
  {
    "x": 156,
    "y": -4940,
    "width": 100,
    "height": 10,
    "color": "white"
  },
  {
    "x": 246,
    "y": -6143,
    "width": 100,
    "height": 10,
    "color": "white"
  },
  {
    "x": 422,
    "y": -6029,
    "width": 100,
    "height": 10,
    "color": "white"
  },
  {
    "x": 159,
    "y": -5512,
    "width": 100,
    "height": 10,
    "color": "white"
  },
  {
    "x": 384,
    "y": -5251,
    "width": 100,
    "height": 10,
    "color": "white"
  },
  {
    "x": 54,
    "y": -5195,
    "width": 100,
    "height": 10,
    "color": "white"
  },
  {
    "x": 220,
    "y": -6512,
    "width": 100,
    "height": 10,
    "color": "white"
  },
  {
    "x": 304,
    "y": -7438,
    "width": 100,
    "height": 10,
    "color": "white"
  },
  {
    "x": 158,
    "y": -4091,
    "width": 100,
    "height": 10,
    "color": "white"
  },
  {
    "x": 333,
    "y": -5042,
    "width": 100,
    "height": 10,
    "color": "white"
  },
  {
    "x": 216,
    "y": -5591,
    "width": 100,
    "height": 10,
    "color": "white"
  },
  {
    "x": 345,
    "y": -7343,
    "width": 100,
    "height": 10,
    "color": "white"
  },
  {
    "x": 68,
    "y": -4745,
    "width": 100,
    "height": 10,
    "color": "white"
  },
  {
    "x": 293,
    "y": -7843,
    "width": 100,
    "height": 10,
    "color": "white"
  },
  {
    "x": 34,
    "y": -7828,
    "width": 100,
    "height": 10,
    "color": "white"
  },
  {
    "x": 371,
    "y": -7012,
    "width": 100,
    "height": 10,
    "color": "white"
  },
  {
    "x": 374,
    "y": -5710,
    "width": 100,
    "height": 10,
    "color": "white"
  },
  {
    "x": 405,
    "y": -5284,
    "width": 100,
    "height": 10,
    "color": "white"
  },
  {
    "x": 145,
    "y": -4211,
    "width": 100,
    "height": 10,
    "color": "white"
  },
  {
    "x": 131,
    "y": -4222,
    "width": 100,
    "height": 10,
    "color": "white"
  },
  {
    "x": 221,
    "y": -5118,
    "width": 100,
    "height": 10,
    "color": "white"
  },
  {
    "x": 262,
    "y": -4833,
    "width": 100,
    "height": 10,
    "color": "white"
  },
  {
    "x": 438,
    "y": -5207,
    "width": 100,
    "height": 10,
    "color": "white"
  },
  {
    "x": 190,
    "y": -7712,
    "width": 100,
    "height": 10,
    "color": "white"
  },
  {
    "x": 416,
    "y": -4907,
    "width": 100,
    "height": 10,
    "color": "white"
  },
  {
    "x": 233,
    "y": -7368,
    "width": 100,
    "height": 10,
    "color": "white"
  },
  {
    "x": 221,
    "y": -6573,
    "width": 100,
    "height": 10,
    "color": "white"
  },
  {
    "x": 3,
    "y": -5097,
    "width": 100,
    "height": 10,
    "color": "white"
  },
  {
    "x": 435,
    "y": -6466,
    "width": 100,
    "height": 10,
    "color": "white"
  },
  {
    "x": 139,
    "y": -7746,
    "width": 100,
    "height": 10,
    "color": "white"
  },
  {
    "x": 101,
    "y": -7385,
    "width": 100,
    "height": 10,
    "color": "white"
  },
  {
    "x": 313,
    "y": -6676,
    "width": 100,
    "height": 10,
    "color": "white"
  },
  {
    "x": 54,
    "y": -5653,
    "width": 100,
    "height": 10,
    "color": "white"
  },
  {
    "x": 152,
    "y": -6386,
    "width": 100,
    "height": 10,
    "color": "white"
  },
  {
    "x": 2,
    "y": -4877,
    "width": 100,
    "height": 10,
    "color": "white"
  },
  {
    "x": 293,
    "y": -5064,
    "width": 100,
    "height": 10,
    "color": "white"
  },
  {
    "x": 293,
    "y": -6668,
    "width": 100,
    "height": 10,
    "color": "white"
  },
  {
    "x": 188,
    "y": -4778,
    "width": 100,
    "height": 10,
    "color": "white"
  },
  {
    "x": 353,
    "y": -6529,
    "width": 100,
    "height": 10,
    "color": "white"
  },
  {
    "x": 199,
    "y": -6472,
    "width": 100,
    "height": 10,
    "color": "white"
  },
  {
    "x": 27,
    "y": -7264,
    "width": 100,
    "height": 10,
    "color": "white"
  },
  {
    "x": 133,
    "y": -7771,
    "width": 100,
    "height": 10,
    "color": "white"
  },
  {
    "x": 60,
    "y": -7525,
    "width": 100,
    "height": 10,
    "color": "white"
  },
  {
    "x": 497,
    "y": -5887,
    "width": 100,
    "height": 10,
    "color": "white"
  },
  {
    "x": 391,
    "y": -6175,
    "width": 100,
    "height": 10,
    "color": "white"
  },
  {
    "x": 328,
    "y": -5857,
    "width": 100,
    "height": 10,
    "color": "white"
  },
  {
    "x": 322,
    "y": -7392,
    "width": 100,
    "height": 10,
    "color": "white"
  },
  {
    "x": 355,
    "y": -4368,
    "width": 100,
    "height": 10,
    "color": "white"
  },
  {
    "x": 465,
    "y": -5945,
    "width": 100,
    "height": 10,
    "color": "white"
  },
  {
    "x": 315,
    "y": -6727,
    "width": 100,
    "height": 10,
    "color": "white"
  },
  {
    "x": 239,
    "y": -4635,
    "width": 100,
    "height": 10,
    "color": "white"
  },
  {
    "x": 377,
    "y": -5365,
    "width": 100,
    "height": 10,
    "color": "white"
  },
  {
    "x": 1,
    "y": -6047,
    "width": 100,
    "height": 10,
    "color": "white"
  },
  {
    "x": 277,
    "y": -4371,
    "width": 100,
    "height": 10,
    "color": "white"
  },
  {
    "x": 273,
    "y": -5480,
    "width": 100,
    "height": 10,
    "color": "white"
  },
  {
    "x": 439,
    "y": -7610,
    "width": 100,
    "height": 10,
    "color": "white"
  },
  {
    "x": 432,
    "y": -5326,
    "width": 100,
    "height": 10,
    "color": "white"
  },
  {
    "x": 132,
    "y": -6644,
    "width": 100,
    "height": 10,
    "color": "white"
  },
  {
    "x": 257,
    "y": -6201,
    "width": 100,
    "height": 10,
    "color": "white"
  },
  {
    "x": 42,
    "y": -5184,
    "width": 100,
    "height": 10,
    "color": "white"
  },
  {
    "x": 376,
    "y": -5833,
    "width": 100,
    "height": 10,
    "color": "white"
  },
  {
    "x": 482,
    "y": -4974,
    "width": 100,
    "height": 10,
    "color": "white"
  },
  {
    "x": 371,
    "y": -4018,
    "width": 100,
    "height": 10,
    "color": "white"
  },
  {
    "x": 384,
    "y": -7027,
    "width": 100,
    "height": 10,
    "color": "white"
  },
  {
    "x": 40,
    "y": -7874,
    "width": 100,
    "height": 10,
    "color": "white"
  },
  {
    "x": 348,
    "y": -6889,
    "width": 100,
    "height": 10,
    "color": "white"
  },
  {
    "x": 379,
    "y": -5876,
    "width": 100,
    "height": 10,
    "color": "white"
  },
  {
    "x": 192,
    "y": -5092,
    "width": 100,
    "height": 10,
    "color": "white"
  },
  {
    "x": 215,
    "y": -4216,
    "width": 100,
    "height": 10,
    "color": "white"
  },
  {
    "x": 180,
    "y": -4757,
    "width": 100,
    "height": 10,
    "color": "white"
  },
  {
    "x": 278,
    "y": -4640,
    "width": 100,
    "height": 10,
    "color": "white"
  },
  {
    "x": 280,
    "y": -7425,
    "width": 100,
    "height": 10,
    "color": "white"
  },
  {
    "x": 324,
    "y": -6177,
    "width": 100,
    "height": 10,
    "color": "white"
  },
  {
    "x": 25,
    "y": -6084,
    "width": 100,
    "height": 10,
    "color": "white"
  },
  {
    "x": 397,
    "y": -6424,
    "width": 100,
    "height": 10,
    "color": "white"
  },
  {
    "x": 169,
    "y": -5862,
    "width": 100,
    "height": 10,
    "color": "white"
  },
  {
    "x": 133,
    "y": -7264,
    "width": 100,
    "height": 10,
    "color": "white"
  },
  {
    "x": 472,
    "y": -5809,
    "width": 100,
    "height": 10,
    "color": "white"
  },
  {
    "x": 346,
    "y": -7674,
    "width": 100,
    "height": 10,
    "color": "white"
  },
  {
    "x": 346,
    "y": -6830,
    "width": 100,
    "height": 10,
    "color": "white"
  },
  {
    "x": 418,
    "y": -4001,
    "width": 100,
    "height": 10,
    "color": "white"
  },
  {
    "x": 233,
    "y": -4938,
    "width": 100,
    "height": 10,
    "color": "white"
  },
  {
    "x": 229,
    "y": -4120,
    "width": 100,
    "height": 10,
    "color": "white"
  },
  {
    "x": 146,
    "y": -7708,
    "width": 100,
    "height": 10,
    "color": "white"
  },
  {
    "x": 38,
    "y": -6055,
    "width": 100,
    "height": 10,
    "color": "white"
  },
  {
    "x": 346,
    "y": -4457,
    "width": 100,
    "height": 10,
    "color": "white"
  },
  {
    "x": 4,
    "y": -4640,
    "width": 100,
    "height": 10,
    "color": "white"
  },
  {
    "x": 378,
    "y": -5825,
    "width": 100,
    "height": 10,
    "color": "white"
  },
  {
    "x": 286,
    "y": -7880,
    "width": 100,
    "height": 10,
    "color": "white"
  },
  {
    "x": 252,
    "y": -5629,
    "width": 100,
    "height": 10,
    "color": "white"
  },
  {
    "x": 187,
    "y": -4778,
    "width": 100,
    "height": 10,
    "color": "white"
  },
  {
    "x": 148,
    "y": -5888,
    "width": 100,
    "height": 10,
    "color": "white"
  },
  {
    "x": 27,
    "y": -5106,
    "width": 100,
    "height": 10,
    "color": "white"
  },
  {
    "x": 117,
    "y": -6196,
    "width": 100,
    "height": 10,
    "color": "white"
  },
  {
    "x": 161,
    "y": -5625,
    "width": 100,
    "height": 10,
    "color": "white"
  },
  {
    "x": 476,
    "y": -4660,
    "width": 100,
    "height": 10,
    "color": "white"
  },
  {
    "x": 262,
    "y": -4258,
    "width": 100,
    "height": 10,
    "color": "white"
  },
  {
    "x": 254,
    "y": -6197,
    "width": 100,
    "height": 10,
    "color": "white"
  },
  {
    "x": 5,
    "y": -6001,
    "width": 100,
    "height": 10,
    "color": "white"
  },
  {
    "x": 171,
    "y": -5749,
    "width": 100,
    "height": 10,
    "color": "white"
  },
  {
    "x": 96,
    "y": -7075,
    "width": 100,
    "height": 10,
    "color": "white"
  },
  {
    "x": 124,
    "y": -7283,
    "width": 100,
    "height": 10,
    "color": "white"
  },
  {
    "x": 385,
    "y": -7391,
    "width": 100,
    "height": 10,
    "color": "white"
  },
  {
    "x": 316,
    "y": -5951,
    "width": 100,
    "height": 10,
    "color": "white"
  },
  {
    "x": 263,
    "y": -5183,
    "width": 100,
    "height": 10,
    "color": "white"
  },
  {
    "x": 454,
    "y": -5629,
    "width": 100,
    "height": 10,
    "color": "white"
  },
  {
    "x": 43,
    "y": -7126,
    "width": 100,
    "height": 10,
    "color": "white"
  },
  {
    "x": 176,
    "y": -4420,
    "width": 100,
    "height": 10,
    "color": "white"
  },
  {
    "x": 72,
    "y": -7960,
    "width": 100,
    "height": 10,
    "color": "white"
  },
  {
    "x": 268,
    "y": -5533,
    "width": 100,
    "height": 10,
    "color": "white"
  },
]
