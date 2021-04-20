//Id colors for the objects
const BG_COLOUR = '#231f20';
const SNAKE_COLOUR = '#c2c2c2';
const FOOD_COLOUR = '#e66916';
const frameWidth = 56; //width of the frame of the truck 
const frameHeight = 54; //height of the frame of the truck 
const scale = 1;
const R_RIGHT = 0;
const R_UP = 3; //frame of the red truck heading up 
const B_RIGHT = 4; //frame of the blue truck heading right 
let frameIndex = 0;

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
  //paintPlayer(state.players[0], size, SNAKE_COLOUR);
  //paintPlayer(state.players[0], 60, 60,State.getState("movingRed"),size);
  paintPlayer(state.players[0],size,B_RIGHT);

  //playerTwo's snake colour
  //paintPlayer(state.players[1], size, 'red');
  // Incorporating state paintPlayer(state.players[1],20, 30,State.getState("movingBlue"),size);
  paintPlayer(state.players[1],size,R_RIGHT);
}


const spriteSheet = new Image();
spriteSheet.src = "https://www.spriters-resource.com/resources/sheets/129/132511.png?updated=1590170477";

//function paintPlayer(playerState,xPos, yPos, state, size)
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


//Frame state of truck
const State = {
  states:[],
  generateState: function(name, startIndex, endIndex){
    if(!this.states[name]){
      this.states[name] = {
        frameIndex: startIndex, 
        startIndex: startIndex,
        endIndex: endIndex
      };
    }
  },
  getState: function(name){
    if(this.states[name]){
      return this.states[name];
    }
  }
};

State.generateState("movingRed", 0, 3);
State.generateState("movingBlue", 4, 7);



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
