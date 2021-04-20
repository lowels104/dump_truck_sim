//Id colors for the objects
const BG_COLOUR = '#231f20';
const SNAKE_COLOUR = '#c2c2c2';
const FOOD_COLOUR = '#e66916';

//Takes the url to connect
const socket = io('https://sleepy-island-33889.herokuapp.com/');

//socket calls function
socket.on('init', handleInit);
socket.on('gameState', handleGameState);
socket.on('gameOver', handleGameOver);
socket.on('gameCode', handleGameCode);
socket.on('unknownCode', handleUnknownCode);
socket.on('tooManyPlayers', handleTooManyPlayers);

//Pulling Elements from alternate files
const gameScreen = document.getElementById('gameScreen');
const initialScreen = document.getElementById('initialScreen');
const newGameBtn = document.getElementById('newGameButton');
const joinGameBtn = document.getElementById('joinGameButton');
const gameCodeInput = document.getElementById('gameCodeInput');
const gameCodeDisplay = document.getElementById('gameCodeDisplay');

//Listeners for the mainScreen buttons
newGameBtn.addEventListener('click', newGame);
joinGameBtn.addEventListener('click', joinGame);

//Starts a newGame
function newGame() {
  socket.emit('newGame');
  init();
}

//Uses code to join an already created game
function joinGame() {
  const code = gameCodeInput.value;
  socket.emit('joinGame', code);
  init();
}

//Gives global access to these across file
let canvas, ctx;
let playerNumber;
let gameActive = false;

//Initalization of the game canvas
function init() {
  initialScreen.style.display = "none";
  gameScreen.style.display = "block";

  canvas = document.getElementById('canvas');
  ctx = canvas.getContext('2d');

  canvas.width = canvas.height = 600;

  //Filling the canvas with BG_COLOUR
  ctx.fillStyle = BG_COLOUR;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  //Action listener for a key being pressed
  document.addEventListener('keydown', keydown);
  gameActive = true;
}

//Sends the event to the server
function keydown(e) {
  socket.emit('keydown', e.keyCode);
}

//paintGame accepts the game object
function paintGame(state) {
  ctx.fillStyle = BG_COLOUR;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const food = state.food;
  const gridsize = state.gridsize;
  //reconciles between pixelSpace and gameSpace
  const size = canvas.width / gridsize;

  //changes colour of food
  ctx.fillStyle = FOOD_COLOUR;
  ctx.fillRect(food.x * size, food.y * size, size, size);

  //playerOne's snake colour
  paintPlayer(state.players[0], size, SNAKE_COLOUR);
  //playerTwo's snake colour
  paintPlayer(state.players[1], size, 'red');
}

//changes colour of snake
function paintPlayer(playerState, size, colour) {
  const snake = playerState.snake;

  ctx.fillStyle = colour;
  for (let cell of snake) {
    ctx.fillRect(cell.x * size, cell.y * size, size, size);
  }
}

//Accepts from server
function handleInit(number) {
  playerNumber = number;
}

//Recieve gameState from the server
function handleGameState(gameState) {
  if (!gameActive) {
    return;
  }
  gameState = JSON.parse(gameState);
  requestAnimationFrame(() => paintGame(gameState));
}

//Displays if Player wins or loses
function handleGameOver(data) {
  if (!gameActive) {
    return;
  }
  data = JSON.parse(data);

  gameActive = false;

  if (data.winner === playerNumber) {
    alert('You Win!');
  } else {
    alert('You Lose :(');
  }
}

//This displays the gameCode to playerOne
function handleGameCode(gameCode) {
  gameCodeDisplay.innerText = gameCode;
}

//Resets to refreshed page if unknown code in entered
function handleUnknownCode() {
  reset();
  alert('Unknown Game Code')
}

//Resets to refreshed page if game is already in progress
function handleTooManyPlayers() {
  reset();
  alert('This game is already in progress');
}

//Resets entire page back to start
function reset() {
  playerNumber = null;
  gameCodeInput.value = '';
  initialScreen.style.display = "block";
  gameScreen.style.display = "none";
}
