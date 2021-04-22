//Importing GRID_SIZE from constants.js
const { GRID_SIZE } = require('./constants');

//Exporting the following modules
module.exports = {
  initGame,
  gameLoop,
  getUpdatedVelocity,
}

//Creates random food for each game
function initGame() {
  const state = createGameState()
  randomFood(state);
  return state;
}

//Creates the players and food
function createGameState() {
  return {
    //player object
    players: [{
      //playerOne position
      pos: {
        x: 50,
        y: 75,
      },
      //playerOne velocity
      vel: {
        x: 1,
        y: 0,
      },
      //snakeOne position
      snake: [
        {x: 1, y: 10},
        {x: 2, y: 10},
        {x: 3, y: 10},
      ],
    }, {
      //playerTwo position
      pos: {
        x: 18,
        y: 10,
      },
      //playerTwo velocity
      vel: {
        x: 1,
        y: 0,
      },
      //snakeTwo position
      snake: [
        {x: 20, y: 10},
        //{x: 19, y: 10},
        //{x: 18, y: 10},
      ],
    }],
    //position of food
    food: {},
    //gameWorlds grid system
    gridsize: GRID_SIZE,
  };
}
const playerOne = state.players[0];
const playerTwo = state.players[1];
//Pushes the game forward
function gameLoop(state) {
  if (!state) {
    return;
  }

  //Define both players
  //const playerOne = state.players[0];
  //const playerTwo = state.players[1];

  //Updating playerOne position
  playerOne.pos.x += playerOne.vel.x;
  playerOne.pos.y += playerOne.vel.y;

  //Updating playerTwo position
  playerTwo.pos.x += playerTwo.vel.x;
  playerTwo.pos.y += playerTwo.vel.y;

  //Checking if playerOne is inbound
  if (playerOne.pos.x < 0 || playerOne.pos.x > GRID_SIZE || playerOne.pos.y < 0 || playerOne.pos.y > GRID_SIZE) {
    return 2;//return 2;
  }

  //Checking if playerTwo is inbound
  if (playerTwo.pos.x < 0 || playerTwo.pos.x > GRID_SIZE || playerTwo.pos.y < 0 || playerTwo.pos.y > GRID_SIZE) {
    return 1; //return 1;
  }

  //Checking if playerOne has picked up food
  if (state.food.x === playerOne.pos.x && state.food.y === playerOne.pos.y) {
    //This is were playerOne score will be added
    
    
    randomFood(state);
  }

  //Checking if playerTwo has picked up food
  if (state.food.x === playerTwo.pos.x && state.food.y === playerTwo.pos.y) {
    //This is were playerTwo score will be added


    randomFood(state);
  }
  
  //Not Sure if this effects the game 

  //Moving playerOne forward
  if (playerOne.vel.x || playerOne.vel.y) {
    playerOne.snake.push({ ...playerOne.pos });
    playerOne.snake.shift();
  }

  //Moving playerTwo forward
  if (playerTwo.vel.x || playerTwo.vel.y) {
    playerTwo.snake.push({ ...playerTwo.pos });
    playerTwo.snake.shift();
  }

  return false;
}

//Spawns food to a new location
function randomFood(state) {
  food = {
    x: Math.floor(Math.random() * GRID_SIZE),
    y: Math.floor(Math.random() * GRID_SIZE),
  }
  
  //Making sure food does not spawn on playerOne
  for (let cell of state.players[0].snake) {
    if (cell.x === food.x && cell.y === food.y) {
      return randomFood(state);
    }
  }

  //Making sure food does not spawn on playerTwo
  for (let cell of state.players[1].snake) {
    if (cell.x === food.x && cell.y === food.y) {
      return randomFood(state);
    }
  }

  state.food = food;
}

//Spawns mutantFood to a new location
function randomMutantFood(state) {

}

//Takes the keypress and moves snake in correct direction
function getUpdatedVelocity(keyCode) {
  switch (keyCode) {
    case 37: { // left
      return { x: -1, y: 0};
    }
    case 38: { // down
      return { x: 0, y: -1};
    }
    case 39: { // right
      return { x: 1, y: 0};
    }
    case 40: { // up
      return { x: 0, y: 1};
    }
  }
}

//Adds 1 to the players score
function FoodScore() {

}

//Adds 2 to the players score
function mutantFoodScore() {

}