//Id colors for the objects
const BG_COLOUR = '#231f20';
const SNAKE_COLOUR = '#c2c2c2';
const FOOD_COLOUR = '#e66916';
const frameWidth = 56; //width of the frame of the truck 
const frameHeight = 54; //height of the frame of the truck 
const scale = 1;
const R_RIGHT = 0; //frame of the red truck heading right
const R_UP = 3; //frame of the red truck heading up 
const B_RIGHT = 4; //frame of the blue truck heading right 

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

  //Draws trash 
  drawTrash(food.x * size, food.y * size);

  //Draw playerOne's truck
  paintPlayer(state.players[0],size,B_RIGHT);

  //Draws playerTwo's truck
  paintPlayer(state.players[1],size,R_RIGHT);
}

//creates the image for the trash 
const trashSprite = new Image();
//trash image source
trashSprite.src = "https://img.icons8.com/metro/52/000000/trash.png";

//draws trash from given x and y coordinates 
function drawTrash(x, y){
  ctx.drawImage(
    trashSprite,
    x,
    y
  );
}

//creates the image for the truck
const spriteSheet = new Image();
//truck image source
spriteSheet.src = "https://www.spriters-resource.com/resources/sheets/129/132511.png?updated=1590170477";

//draws image of the player's truck
function paintPlayer(playerState,size,frame){
  const snake = playerState.snake;
  for (let cell of snake) {
  ctx.drawImage(
    spriteSheet, //source image
    frame * frameWidth, //x-axis of source image
    0,  //y-axis of source image
    frameWidth, //frameWidth and frameHeight select the frame of the sprite used
    frameHeight,
    cell.x * size, //xPos on canvas
    cell.y * size, //yPos on canvas
    frameWidth * scale, 
    frameHeight * scale
  );
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
