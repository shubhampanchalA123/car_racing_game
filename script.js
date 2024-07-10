const currentScore = document.querySelector('.currentScore');
const recordScore = document.querySelector('.recordScore');
const initialScreen = document.querySelector('.initialScreen');
const racingArea = document.querySelector('.racingArea');
const clickToPlay = document.querySelector('.clickToPlay');

clickToPlay.addEventListener('click', startGame);
initialScreen.addEventListener('click', restartGame);
document.addEventListener('keydown', handleKeyDown);
document.addEventListener('keyup', handleKeyUp);

let controls = {
  ArrowUp: false,
  ArrowDown: false,
  ArrowLeft: false,
  ArrowRight: false,
};

let gameState = {
  speed: 5,
  score: 0,
  highScore: 0,
  coinCount: 0,
  isActive: false,
  steeringAngle: 0, // Initially the steering wheel angle is 0 degrees
};

function handleKeyDown(e) {
  controls[e.key] = true;
}

function handleKeyUp(e) {
  controls[e.key] = false;
}

function startGame() {
  racingArea.innerHTML = "";

  const scoreContainer = document.createElement('div');
  scoreContainer.classList.add('scoreContainer');

  const newCurrentScore = document.createElement('div');
  newCurrentScore.classList.add('currentScore');
  scoreContainer.appendChild(newCurrentScore);

  const newRecordScore = document.createElement('div');
  newRecordScore.classList.add('recordScore');
  scoreContainer.appendChild(newRecordScore);

  const newCoinCounter = document.createElement('div');
  newCoinCounter.classList.add('coinCounter');
  newCoinCounter.textContent = 'Coins: 0';
  scoreContainer.appendChild(newCoinCounter);

  racingArea.appendChild(scoreContainer);

  initialScreen.classList.add('hidden');
  gameState.isActive = true;
  gameState.score = 0;
  gameState.coinCount = 0;

  // Create steering wheel image
  const steeringWheel = document.createElement('img');
  steeringWheel.src = 'image/stareeing.png'; // Replace with your actual path
  steeringWheel.classList.add('steeringWheel');
  steeringWheel.style.position = 'absolute';
  steeringWheel.style.left = '82%';
  steeringWheel.style.bottom = '26%';
  steeringWheel.style.transform = 'translateX(-50%)';
  steeringWheel.style.width = '80px'; // Adjust size as needed
  steeringWheel.style.height = '80px'; // Adjust size as needed
  steeringWheel.style.cursor = 'pointer';
  racingArea.appendChild(steeringWheel);

  // Add event listeners for steering wheel movement
  let isSteering = false;
  let startAngle = 0;

  steeringWheel.addEventListener('mousedown', handleMouseDown);
  steeringWheel.addEventListener('touchstart', handleTouchStart);
  document.addEventListener('mousemove', handleMouseMove);
  document.addEventListener('touchmove', handleTouchMove);
  document.addEventListener('mouseup', handleMouseUp);
  document.addEventListener('touchend', handleTouchEnd);

  function handleMouseDown(e) {
    isSteering = true;
    startAngle = getAngle(e);
  }

  function handleTouchStart(e) {
    isSteering = true;
    startAngle = getAngle(e.touches[0]);
  }

  function handleMouseMove(e) {
    if (!isSteering) return;
    let currentAngle = getAngle(e);
    let rotateAngle = currentAngle - startAngle;
    gameState.steeringAngle += rotateAngle;
    updateCarDirection();
    startAngle = currentAngle;
  }

  function handleTouchMove(e) {
    if (!isSteering) return;
    let currentAngle = getAngle(e.touches[0]);
    let rotateAngle = currentAngle - startAngle;
    gameState.steeringAngle += rotateAngle;
    updateCarDirection();
    startAngle = currentAngle;
  }

  function handleMouseUp() {
    isSteering = false;
  }

  function handleTouchEnd() {
    isSteering = false;
  }

  function getAngle(e) {
    let rect = steeringWheel.getBoundingClientRect();
    let centerX = rect.left + rect.width / 2;
    let centerY = rect.top + rect.height / 2;
    let mouseX = e.clientX || e.touches[0].clientX;
    let mouseY = e.clientY || e.touches[0].clientY;
    let radians = Math.atan2(mouseY - centerY, mouseX - centerX);
    let angle = radians * (180 / Math.PI);
    return angle;
  }

  function updateCarDirection() {
    // Limit steering angle between -45 and 45 degrees
    gameState.steeringAngle = Math.min(Math.max(gameState.steeringAngle, -45), 45);
    // Convert steering angle to a scale from -1 (left) to 1 (right)
    let direction = gameState.steeringAngle / 45;
    moveCar(direction);
  }

  window.requestAnimationFrame(runGame);

  for (let i = 0; i < 5; i++) {
    let roadStripe = document.createElement('div');
    roadStripe.setAttribute('class', 'roadStripe');
    roadStripe.y = (i * 140);
    roadStripe.style.top = roadStripe.y + "px";
    racingArea.appendChild(roadStripe);
  }

  for (let i = 0; i < 3; i++) {
    let opponentCar = document.createElement('div');
    opponentCar.setAttribute('class', 'opponentCar');
    opponentCar.y = ((i) * -300);
    opponentCar.style.top = opponentCar.y + "px";
    racingArea.appendChild(opponentCar);
    opponentCar.style.left = Math.floor(Math.random() * 350) + "px";
  }

  for (let i = 0; i < 3; i++) {
    let coin = document.createElement('div');
    coin.setAttribute('class', 'coin');
    coin.y = ((i) * -200);
    coin.style.top = coin.y + "px";
    racingArea.appendChild(coin);
    coin.style.left = Math.floor(Math.random() * 350) + "px";
  }

  let racerCar = document.createElement('div');
  racerCar.setAttribute('class', 'racerCar');
  racingArea.appendChild(racerCar);
  gameState.x = racerCar.offsetLeft;
  gameState.y = racerCar.offsetTop;
}

function runGame() {
  let racerCar = document.querySelector('.racerCar');
  let road = racingArea.getBoundingClientRect();

  if (gameState.isActive) {
    moveStripes();
    moveOpponents(racerCar);
    moveCoins(racerCar);

    if (controls.ArrowUp && gameState.y > (road.top + 70)) { gameState.y -= gameState.speed; }
    if (controls.ArrowDown && gameState.y < (road.height - 75)) { gameState.y += gameState.speed; }
    if (controls.ArrowRight && gameState.x < 350) { gameState.x += gameState.speed; }
    if (controls.ArrowLeft && gameState.x > 0) { gameState.x -= gameState.speed; }

    racerCar.style.top = gameState.y + "px";
    racerCar.style.left = gameState.x + "px";

    document.querySelector('.recordScore').innerHTML = "High Score: " + (gameState.highScore - 1);
    gameState.score++;
    gameState.speed += 0.01;

    if (gameState.highScore < gameState.score) {
      gameState.highScore++;
      document.querySelector('.recordScore').innerHTML = "High Score: " + (gameState.highScore - 1);
    }

    document.querySelector('.currentScore').innerHTML = "Score: " + (gameState.score - 1);
    document.querySelector('.coinCounter').innerHTML = "Coins: " + gameState.coinCount;

    window.requestAnimationFrame(runGame);
  }
}

function moveStripes() {
  let roadStripes = document.querySelectorAll('.roadStripe');
  roadStripes.forEach(function (item) {
    if (item.y >= 750) {
      item.y -= 800;
    }
    item.y += gameState.speed;
    item.style.top = item.y + "px";
  });
}

function checkCollision(a, b) {
  let aRect = a.getBoundingClientRect();
  let bRect = b.getBoundingClientRect();

  return !(
    (aRect.bottom < bRect.top) ||
    (aRect.top > bRect.bottom) ||
    (aRect.right < bRect.left) ||
    (aRect.left > bRect.right)
  );
}

function moveOpponents(racerCar) {
  let opponentCars = document.querySelectorAll('.opponentCar');
  opponentCars.forEach(function (item) {
    if (checkCollision(racerCar, item)) {
      endGame();
    }
    if (item.y >= 750) {
      item.y = -300;
      item.style.left = Math.floor(Math.random() * 350) + "px";
    }
    item.y += gameState.speed;
    item.style.top = item.y + "px";
  });
}

function moveCoins(racerCar) {
  let coins = document.querySelectorAll('.coin');
  coins.forEach(function (item) {
    if (checkCollision(racerCar, item)) {
      gameState.coinCount++;
      item.y = -100;
      item.style.top = item.y + "px";
      item.style.left = Math.floor(Math.random() * (racingArea.offsetWidth - 30)) + "px";
    }
    if (item.y >= 750) {
      item.y = -100;
      item.style.left = Math.floor(Math.random() * (racingArea.offsetWidth - 30)) + "px";
    }
    item.y += gameState.speed;
    item.style.top = item.y + "px";
  });
}

function endGame() {
  gameState.isActive = false;
  gameState.speed = 5;
  initialScreen.classList.remove('hidden');
  initialScreen.innerHTML = "Game Over<br>Click here to restart";
}

function restartGame() {
  startGame();
}
