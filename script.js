// gameboard starts with 0 not one so: 25 x 25 is 0 to 24
const gameBoard = document.getElementById("gameBoard");
// ctx = context, GetContext to acces drawing functions
const ctx = gameBoard.getContext("2d");
const scoreText = document.getElementById("scoreText");
const resetBtn = document.getElementById("resetBtn");
const playBtn = document.getElementById("playBtn");
const unitSize = 25;
let currentWindowWidth = window.innerWidth;
let currentWindowHeight = window.innerHeight;
let gameHeight = Math.floor(currentWindowHeight / unitSize) * unitSize;
let gameWidth = Math.floor(currentWindowWidth / unitSize) * unitSize;

gameBoard.height = gameHeight;
gameBoard.width = gameWidth;
let initialPlay = false;
let boardBackground = "rgb(51, 50, 59)"; //--backgroundPurple
let snakeColor = "rgb(194, 191, 222)"; //--lightcolor1
let foodColor = "rgb(124, 119, 166)"; //--darkercolor1
let isRunning = false;
// xVelocity & yVelocit control wether we're moving up down etc.
let speed = 25; // MUST BE MULTIPLE OF unitSize !
let xVelocity = speed;
let yVelocity = 0;
let foodX;
let foodY;
let currentScore = 0;
// snake is an array, each body segment is an Object with x and y
let snake = [
  { x: unitSize * 3, y: 0 },
  { x: unitSize * 2, y: 0 },
  { x: unitSize, y: 0 },
  { x: 0, y: 0 },
];

window.addEventListener("keydown", changeDirection);
resetBtn.addEventListener("click", resetGame);
playBtn.addEventListener("click", gameStart);

//toggle PopUp Menu
function togglePopUp() {
  const PopUp = document.querySelector(".PopUp");
  PopUp.classList.toggle("IsOpen");
  if (initialPlay == false) {
    scoreText.classList.toggle("IsOpen");
    playBtn.classList.toggle("IsOpen");
    initialPlay = true;
  }
}
// starts the Game
function gameStart() {
  togglePopUp();
  isRunning = true;
  scoreText.textContent = currentScore;
  createFood();
  drawFood();
  nextTick();
}
//
function nextTick() {
  if (isRunning == true) {
    // note : setTimeout() gets called every x seconds
    tickTimer = setTimeout(() => {
      clearBoard();
      drawFood();
      moveSnake();
      drawSnake();
      checkIsGameOver();
      nextTick();
    }, 100); //75 miliseconds
  } else {
    displayGameOver();
  }
}
//
function clearBoard() {
  ctx.fillStyle = boardBackground;
  ctx.fillRect(0, 0, gameWidth, gameHeight);
}
// generate random spot to generate a food for snek
function createFood() {
  function randomFood(min, max) {
    const randomNumber =
      Math.round((Math.random() * (max - min) + min) / unitSize) * unitSize;
    return randomNumber;
  }
  foodX = randomFood(0, gameWidth - unitSize);
  foodY = randomFood(0, gameHeight - unitSize);
}
// draws food
function drawFood() {
  ctx.fillStyle = foodColor;
  ctx.fillRect(foodX, foodY, unitSize, unitSize);
}
// basically adds a head and removes tail to move forward
function moveSnake() {
  const head = { x: snake[0].x + xVelocity, y: snake[0].y + yVelocity };
  // unshift "adds" a new head
  snake.unshift(head);
  // if food is eaten
  if (snake[0].x == foodX && snake[0].y == foodY) {
    currentScore += 1;
    scoreText.textContent = currentScore;
    createFood();
  } else {
    snake.pop();
  }
}
//
function drawSnake() {
  ctx.fillStyle = snakeColor;
  snake.forEach((snakePart) => {
    ctx.fillRect(snakePart.x, snakePart.y, unitSize, unitSize);
  });
}
//
function changeDirection(event) {
  const keyPressed = event.keyCode;
  //keycodes
  const leftArrow = 37;
  const rightArrow = 39;
  const upArrow = 38;
  const downArrow = 40;
  const leftLetter = 65;
  const rightLetter = 68;
  const upLetter = 87;
  const downLetter = 83;

  const goingUp = yVelocity == -unitSize;
  const goingDown = yVelocity == unitSize;
  const goingLeft = xVelocity == -unitSize;
  const goingRight = xVelocity == unitSize;

  switch (true) {
    // going left (can't go left if already moving to the right)
    case (keyPressed == leftArrow || keyPressed == leftLetter) && !goingRight:
      xVelocity = -unitSize;
      yVelocity = 0;
      break;
    // going right (can't go left if already moving to the left)
    case (keyPressed == rightArrow || keyPressed == rightLetter) && !goingLeft:
      xVelocity = unitSize;
      yVelocity = 0;
      break;
    // going up (can't go left if already moving down)
    case (keyPressed == upArrow || keyPressed == upLetter) && !goingDown:
      xVelocity = 0;
      yVelocity = -unitSize;
      break;
    // going down (can't go left if already moving up)
    case (keyPressed == downArrow || keyPressed == downLetter) && !goingUp:
      xVelocity = 0;
      yVelocity = unitSize;
      break;
  }
}
// set isRunning to false if loose condition occurs
function checkIsGameOver() {
  switch (true) {
    case snake[0].x >= gameWidth || snake[0].x < 0:
      isRunning = false;
      break;
    case snake[0].y >= gameHeight || snake[0].y < 0:
      isRunning = false;
      break;
  }
  for (let i = 1; i < snake.length; i++) {
    if (snake[0].x == snake[i].x && snake[0].y == snake[i].y) {
      isRunning = false;
    }
  }
}
//
function displayGameOver() {
  scoreText.textContent = "GAMER OVER, SCORE: " + currentScore;
  isRunning = false;
  togglePopUp();
}
//
function resetGame() {
  clearInterval(tickTimer);
  currentScore = 0;
  xVelocity = unitSize;
  yVelocity = 0;
  snake = [
    { x: unitSize * 3, y: 0 },
    { x: unitSize * 2, y: 0 },
    { x: unitSize, y: 0 },
    { x: 0, y: 0 },
  ];
  gameStart();
}
