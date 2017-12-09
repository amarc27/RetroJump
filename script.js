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

var playerImg = new Image();
playerImg.src = 'Images/Elon.png';

var bgImg = new Image();
bgImg.src = "Images/Space1.jpg";

var maxenceImg = new Image();
maxenceImg.src = "Images/maxence.png";

var bestScore = 0;
gameOver = false;


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
    ctx.drawImage(playerImg, this.x - this.radius, this.y - this.radius + speed*iFrame, 2*this.radius, 2*this.radius);
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
          else if (platforms[i].power === "toLevelTwo" ||
                  platforms[i].power === "toLevelThree" ||
                  platforms[i].power === "toLevelFour")
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

    //Platforms that go to the next level
    if (this.power === "toLevelTwo") {
      canvas.style.letterSpacing = "3px";
      ctx.font = '18px Designer Block';
      ctx.fillStyle = "white";
      ctx.fillText("TO LEVEL 2", 155, -25 + speed * iFrame);
    }
    else if (this.power === "toLevelThree") {
      ctx.font = '18px Designer Block';
      ctx.fillStyle = "white";
      ctx.fillText("TO LEVEL 3", 155, -4630 + speed * iFrame);
    }
    else if (this.power === "toLevelFour") {
      ctx.font = '18px Designer Block';
      ctx.fillStyle = "white";
      ctx.fillText("TO LEVEL 4", 155, -9630 + speed * iFrame);
    }
  }
}




function Score(x, y, color) {
  this.x = x;
  this.y = y;
  this.color = color;
  this.draw = function() {
    ctx.fillStyle = this.color;
    ctx.font = '16px Designer Block';
    ctx.fillText(Math.floor(iFrame), this.x, this.y);
  }
}


function LevelIndicator(x, y, color, number) {
  this.x = x;
  this.y = y;
  this.color = color;
  this.draw = function() {
    ctx.fillStyle = this.color;
    ctx.font = '16px Designer Block';
    ctx.fillText(("Level " + number), this.x, this.y);
  }
}



function MonsterMaxence(x, y, color, radius) {
  this.x = x;
  this.y = y;
  this.color = color;
  this.radius = radius;
  this.draw = function() {
    ctx.drawImage(maxenceImg, this.x - this.radius, this.y - this.radius + speed*iFrame, 2*this.radius, 2*this.radius);
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
  this.monsterMaxence = new MonsterMaxence(200, -580, "white", 35);



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
    that.whenAMonsterIsTouched();

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
    ctx.drawImage(bgImg, 0, bgy, width, height);
    ctx.drawImage(bgImg, 0, bgy + height, width, height);
  }
}

//GAME OVER
IronDoodleGame.prototype.checkIfGameOver = function() {
  if (this.player.getRefY() >= 600) {
    console.log("Game Over !");

    // Draw the black background
    ctx.fillStyle = "#B5FDF8";
    ctx.fillRect(0, 0, 400, 600);

    //Write Game Over
    ctx.font = '38px Designer Block';
    ctx.fillStyle = "black";
    ctx.fillText("Game over !", 90, 200);

    //Write the best score
    ctx.font = '20px Designer Block';
    ctx.fillStyle = "green";
    ctx.fillText("Best score : "+ bestScore, 95, 260);

    //Write the score
    ctx.font = '20px Designer Block';
    ctx.fillStyle = "red";
    ctx.fillText("Your score : "+ iFrame, 100, 290);
    clearInterval(this.myInterval);

    //Comment the score
    if (iFrame < bestScore) {
      ctx.font = '16px Designer Block';
      ctx.fillStyle = "black";
      ctx.fillText("You are the biggest looser", 60, 340);
      ctx.fillText("I've ever seen !", 130, 355);
    }

    if (iFrame > bestScore) {
      ctx.font = '18px Designer Block';
      ctx.fillStyle = "black";
      ctx.fillText("Well done ! You've set a new high score.", 35, 340);
    }


    setScore(iFrame);
  }
}


IronDoodleGame.prototype.whenAMonsterIsTouched = function() {
  if (this.player.y - this.player.radius < this.monsterMaxence.y + this.monsterMaxence.radius &&
  this.player.y + this.player.radius > this.monsterMaxence.y - this.monsterMaxence.radius &&
  this.player.x + this.player.radius > this.monsterMaxence.x - this.monsterMaxence.radius &&
  this.player.x - this.player.radius < this.monsterMaxence.x + this.monsterMaxence.radius) {

  }
}




//TOUT DESSINER
IronDoodleGame.prototype.drawEverything = function() {
  ctx.clearRect(0, 0, 400, 600);
  this.drawBackground();

  for (var i = 0; i < this.platforms.length; i++) {
    this.platforms[i].draw();
  }
  //Platforms that go to the next level
  if (bestScore >= 4000) {
    this.platforms.push(new Platform(0, -47, 1000, 30, "blue", "toLevelTwo"))
  }
  if (bestScore >= 7000) {
    this.platforms.push(new Platform(0, -4650, 1000, 30, "blue", "toLevelThree"))
  }
  if (bestScore >= 11000) {
    this.platforms.push(new Platform(0, -9650, 1000, 30, "blue", "toLevelFour"))
  }

  //Level Indicator
  if ((Math.floor(iFrame) >= 0) && (Math.floor(iFrame) <= 4000)) {
    this.levelIndicator = new LevelIndicator(320, 30, "yellow", "1");
  }

  if ((Math.floor(iFrame) >= 4001) && (Math.floor(iFrame) <= 8600)) {
    this.levelIndicator = new LevelIndicator(320, 30, "yellow", "2");
  }

  if ((Math.floor(iFrame) >= 8600) && (Math.floor(iFrame) <= 11001)) {
    this.levelIndicator = new LevelIndicator(320, 30, "yellow", "3");
  }


  this.player.draw();
  this.score.draw();
  this.levelIndicator.draw();
  this.monsterMaxence.draw();
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
