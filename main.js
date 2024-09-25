// TODO: implement winning logic
// TODO: if rollResult is more than 300 or equal to it the player gets another turn
// TODO: try and make players that stand in the same place not drawn above each other
// TODO: make animations (maybe) :/

// Initializing the game
/** @type {HTMLCanvasElement} */
const canvas = document.getElementById("playground");
/** @type {CanvasRenderingContext2D} */
const ctx = canvas.getContext("2d");
const visualOutput = document.querySelectorAll(".visual-output");
const DICE_SOUND_EFFECT = new Audio(
  "assets/sound effects/dice_sound_effect.mp3"
);

canvas.width = 750;
canvas.height = 750;

let doNotShow = false;
let isKeyPressed = false;

const BLOCK_SIZE = 50;
let horizontalBordersAmount = canvas.width / 50;
let verticalBordersAmount = canvas.height / 50;

let xPossibleMoves;
let yPossibleMoves;
let rollResult;

const rectWidth = 300;
const rectHeight = 300;
const rectWidth2 = BLOCK_SIZE;
const rectHeight2 = BLOCK_SIZE;

const positions = [
  [
    { x: 0, y: 0 },
    { x: 0, y: 250 },
    { x: 0, y: 0 },
    { x: 250, y: 0 },
  ],
  [
    { x: 450, y: 0 },
    { x: 450, y: 250 },
    { x: 450, y: 0 },
    { x: 700, y: 0 },
  ],
  [
    { x: 450, y: 450 },
    { x: 450, y: 700 },
    { x: 450, y: 450 },
    { x: 700, y: 450 },
  ],
  [
    { x: 0, y: 450 },
    { x: 0, y: 700 },
    { x: 0, y: 450 },
    { x: 250, y: 450 },
  ],
  [{ x: 50, y: 350 }],
  [{ x: 350, y: 50 }],
  [{ x: 400, y: 350 }],
  [{ x: 350, y: 400 }],
  [{ x: 300, y: 350 }],
  [{ x: 300, y: 300 }],
  [{ x: 400, y: 300 }],
  [{ x: 350, y: 400 }],
  [{ x: 50, y: 300 }],
  [{ x: 400, y: 50 }],
  [{ x: 650, y: 400 }],
  [{ x: 300, y: 650 }],
];

const drawBases = (
  standard,
  index,
  color,
  width = BLOCK_SIZE,
  height = BLOCK_SIZE
) => {
  if (standard) {
    for (let i = 0; i < positions[index].length; i++) {
      switch (i) {
        case 0:
        case 1:
          ctx.beginPath();
          ctx.fillStyle = color;
          ctx.fillRect(
            positions[index][i].x,
            positions[index][i].y,
            rectWidth,
            rectHeight2
          );
          ctx.closePath();
          break;
        case 2:
        case 3:
          ctx.beginPath();
          ctx.fillStyle = color;
          ctx.fillRect(
            positions[index][i].x,
            positions[index][i].y,
            rectWidth2,
            rectHeight
          );
          ctx.closePath();
          break;
      }
    }
  } else {
    for (let i = 0; i < positions[index].length; i++) {
      ctx.beginPath();
      ctx.fillStyle = color;
      ctx.fillRect(positions[index][i].x, positions[index][i].y, width, height);
      ctx.closePath();
    }
  }
};

const drawHorizontalBorders = () => {
  for (let index = 0; index < horizontalBordersAmount; index++) {
    ctx.beginPath();
    ctx.fillStyle = "black";
    ctx.rect(index * BLOCK_SIZE, 0, 1, canvas.height);
    ctx.fill();
    ctx.closePath();
  }
};

const drawVerticalBorders = () => {
  for (let index = 0; index < verticalBordersAmount; index++) {
    ctx.beginPath();
    ctx.fillStyle = "black";
    ctx.rect(0, index * BLOCK_SIZE, canvas.width, 1);
    ctx.fill();
    ctx.closePath();
  }
};

const SAFE_AREAS_POSITIONS = [
  { x: 50, y: 300 },
  { x: 300, y: 100 },
  { x: 400, y: 50 },
  { x: 600, y: 300 },
  { x: 650, y: 400 },
  { x: 400, y: 600 },
  { x: 300, y: 650 },
  { x: 100, y: 400 },
];

function drawSafeAreas()
{
  for(const position of SAFE_AREAS_POSITIONS)
  {
    ctx.beginPath();
    ctx.arc(position.x + 25, position.y + 25, 20, 0, Math.PI * 2);
    ctx.strokeStyle = 'grey';
    ctx.stroke();          
    ctx.closePath();
  }
}

// Initializing the players
class Players
{
  constructor(x, y, id, team, imgSrc)
  {
    this.x = x;
    this.y = y;
    this.width = BLOCK_SIZE;
    this.height = BLOCK_SIZE;
    this.image = new Image();
    this.image.src = imgSrc;
    this.id = id;
    this.team = team;
    this.totalMoves = 0;
    this.isTurn = false;
    this.inBase = true;
    this.onTrack = false;
    this.hasWon = false;
  }
  
  draw()
  {
    ctx.beginPath();
    ctx.drawImage(this.image, this.x, this.y);
    ctx.closePath();
  }
}

const redPlayers = [];
const greenPlayers = [];
const yellowPlayers = [];
const bluePlayers = [];
const offset = BLOCK_SIZE / 2;
const PLAYERS_INITIAL_POSITIONS = [
  [
    { x: 100 - offset, y: 100 - offset },
    { x: 200 - offset, y: 100 - offset },
    { x: 100 - offset, y: 200 - offset },
    { x: 200 - offset, y: 200 - offset },
  ],
  [
    { x: 550 - offset, y: 100 - offset },
    { x: 650 - offset, y: 100 - offset },
    { x: 550 - offset, y: 200 - offset },
    { x: 650 - offset, y: 200 - offset },
  ],
  [
    { x: 550 - offset, y: 550 - offset },
    { x: 650 - offset, y: 550 - offset },
    { x: 550 - offset, y: 650 - offset },
    { x: 650 - offset, y: 650 - offset },
  ],
  [
    { x: 100 - offset, y: 550 - offset },
    { x: 200 - offset, y: 550 - offset },
    { x: 100 - offset, y: 650 - offset },
    { x: 200 - offset, y: 650 - offset },
  ],
];

let canRollDice = false;
let selectInstance;
const allPlayers = []; // to hold all of the players teams inside of objects

function whoGetSixGetsAnotherTurn(selector)
{
  if(rollResult >= 300)
  {
    selector -= 1;
    if(selector < 0)
    {
      selector = allPlayers.length - 1;
    }
  }
}

// i have a better approach for this just change the x axis for green and blue, y axis for red and yellow
// for green decrease the x axis by 50, for blue increase by 50
// for red increase the y axis by 50, for yellow decrease by 50
// after thinking about it my current approach is more dynamic :)
function handleTransition(player, team)
{
  let isfirstTime = true;

  if(player.onTrack)
  {
    isfirstTime = false;
    player.totalMoves += rollResult;
  }

  if(player.totalMoves >= 2500)
  {
    player.onTrack = false;
  }

  // 2800 - player.totalMoves: possible moves
  // rollResult <= 2800 - player.totalMoves - rollResult
  // rollResult <= 2800 - (player.totalMoves - (!isfirstTime ? rollResult : 0))
  if(!player.onTrack && rollResult <= 2800 - (player.totalMoves - (!isfirstTime ? rollResult : 0)))
  {
    player.totalMoves += isfirstTime ? rollResult : 0;
    const specialTrackMoves = player.totalMoves - 2500;

    switch(team.name)
    {
      case "Team Red":
        player.x = 0;
        player.y = 350;
        player.x += specialTrackMoves;
        break;
      case "Team Green":
        player.x = 350;
        player.y = 0;
        player.y += specialTrackMoves;
        break;
      case "Team Yellow":
        player.x = 700;
        player.y = 350;
        player.x -= specialTrackMoves;
        break;
      case "Team Blue":
        player.x = 350;
        player.y = 700;
        player.y -= specialTrackMoves;
        break;
    }
  }

  if(player.totalMoves === 2800)
  {
    player.hasWon = true;
  }
}

function animatePlayerMovement(player, newX, newY, onComplete) {
  gsap.to(player, {
    x: newX,
    y: newY,
    duration: 1, // adjust duration for smoother or faster animations
    ease: "power1.inOut",
    onUpdate: function() {
      drawGame(); // continuously redraw the game as the player moves
    },
    onComplete: onComplete // callback when the animation completes
  });
}

function stepOver(player) {
  for (let i = 0; i < allPlayers.length; i++) {
    for (let j = 0; j < 4; j++) {
      const steppedOverPlayer = allPlayers[i].arrayOfPlayers[j];

      if (player.x === steppedOverPlayer.x && player.y === steppedOverPlayer.y && player.team !== steppedOverPlayer.team) {

        // make sure that the steppedOverPlayer isn't standing in a safe area
        for(const position of SAFE_AREAS_POSITIONS)
        {
          if(steppedOverPlayer.x === position.x && steppedOverPlayer.y === position.y)
          {
            return;
          }
        }

        let initialPosition;

        // Match the steppedOverPlayer with the correct initial position
        switch (steppedOverPlayer.team) {
          case "red":
            initialPosition = PLAYERS_INITIAL_POSITIONS[0][j];
            break;
          case "green":
            initialPosition = PLAYERS_INITIAL_POSITIONS[1][j];
            break;
          case "yellow":
            initialPosition = PLAYERS_INITIAL_POSITIONS[2][j];
            break;
          case "blue":
            initialPosition = PLAYERS_INITIAL_POSITIONS[3][j];
            break;
          default:
            console.error("Unknown team:", steppedOverPlayer.team);
            return;
        }

        // animate the player back to their initial position
        animatePlayerMovement(steppedOverPlayer, initialPosition.x, initialPosition.y, function()
        {
          steppedOverPlayer.inBase = true;
          steppedOverPlayer.onTrack = false;
          steppedOverPlayer.totalMoves = 0;
        });
        
        return;
      }
    }
  }
}

const turnSkipperFunction = (selector) =>
{
  let turnSkipper = 0; // if this number is 4 or above the current turn will be skipped
  let winningPlayersCount = 0; // or ones that can't move excluding the ones inside the base

  for(let index = 0; index < 4; index++)
  {
    const player = allPlayers[selector].arrayOfPlayers[index];

    if(!player.hasWon && !player.inBase && rollResult <= 2800 - (player.totalMoves + rollResult))
    {
      canRollDice = false;
      return;
    }
    // 2800 - player.totalMoves
    else if(rollResult > 2800 - player.totalMoves || player.hasWon)
    {
      winningPlayersCount++;
    }

    if(player.inBase && rollResult < 300)
    {
      turnSkipper++;
    }
  }

  canRollDice = turnSkipper >= (4 - winningPlayersCount);
};

// make a property that holds the win state of the players array
// instead of making an array for the winning players
// saving computer memory :)
// problem is how will I know the 1st, 2nd, 3rd etc. position of the team ???
const winningPlayers = [];
const winPositions = ["1st", "2nd", "3rd", "4th"];

function winHandler(team)
{
  let winningPlayersNumber = 0; // to hold the number of tokens that have won on the current team

  for(let index = 0; index < team.arrayOfPlayers.length; index++)
  {
    if(team.arrayOfPlayers[index].hasWon) // checking if the token have won or not
    {
      winningPlayersNumber++;
    }
  }

  if(winningPlayersNumber >= 4)
  {
    if(!team.won)
    {
      team.won = true;
      winningPlayers.push(team);
      allPlayers.splice(allPlayers.indexOf(team), 1); // remove the team that have won out of the game
    }
  }

  if((allPlayers.length + winningPlayers.length) - winningPlayers.length <= 1) // if winning teams exceeds the limit the game ends
  {
    if(!allPlayers[0].won) // check the win state of the team.
    {
      allPlayers[0].won = true;
      winningPlayers.push(allPlayers[0]); // push the team that haven't win yet because the game is coming to an end
    }
    
    for(let index = 0; index < winningPlayers.length; index++)
    {
      alert(`${winningPlayers[index].name} ${winPositions[index]} !`);
    }

    // remove input handling because the game is over
    document.removeEventListener("keydown", handleInput);
    document.removeEventListener("keydown", diceRollingHandler);
    document.removeEventListener("keyup", keyUpHandler);
  }
}

function handleInput(event)
{
  for(let index = 1; index < 5; index++)
  {
    if(event.key === String(index))
    {
      const team = allPlayers[this.selector];
      const player = team.arrayOfPlayers[index - 1];
      const maxMoves = 2800 - player.totalMoves;
    
      if(team.name === "Team Red")
      {
        if(player.inBase && rollResult >= 300 && this.firstTime)
        {
          player.x = 50;
          player.y = 300;
          player.inBase = false;
          player.onTrack = true;
          this.firstTime = false;
          canRollDice = true;
        }
        else if(!player.inBase && !player.hasWon && rollResult <= maxMoves && this.firstTime)
        {
          handleTransition(player, team);
          if(player.onTrack)
          {
          handleLines(detectLocation(player), player);
          }
    
          stepOver(player);
          winHandler(team);
    
          this.firstTime = false;
          canRollDice = true;
        }
      }
      else if(team.name === "Team Green")
      {
        if(player.inBase && rollResult >= 300 && this.firstTime)
        {
          player.x = 400;
          player.y = 50;
          player.inBase = false;
          player.onTrack = true;
          this.firstTime = false;
          canRollDice = true;
        }
        else if(!player.inBase && !player.hasWon && rollResult <= maxMoves && this.firstTime)
        {
          handleTransition(player, team);
          if(player.onTrack)
          {
            handleLines(detectLocation(player), player);
          }
    
          stepOver(player);
          winHandler(team);
    
          this.firstTime = false;
          canRollDice = true;
        }
      }
      else if(team.name === "Team Yellow")
      {
        if(player.inBase && rollResult >= 300 && this.firstTime)
        {
          player.x = 650;
          player.y = 400;
          player.inBase = false;
          player.onTrack = true;
          this.firstTime = false;
          canRollDice = true;
        }
        else if(!player.inBase && !player.hasWon && rollResult <= maxMoves && this.firstTime)
        {
          handleTransition(player, team);
          if(player.onTrack)
          {
            handleLines(detectLocation(player), player);
          }
      
          stepOver(player);
          winHandler(team);
      
          this.firstTime = false;
          canRollDice = true;
        }
      }
      else if(team.name === "Team Blue")
      {
        if(player.inBase && rollResult >= 300 && this.firstTime)
        {
          player.x = 300;
          player.y = 650;
          player.inBase = false;
          player.onTrack = true;
          this.firstTime = false;
          canRollDice = true;
        }
        else if(!player.inBase && !player.hasWon && rollResult <= maxMoves && this.firstTime)
        {
          handleTransition(player, team);
          if(player.onTrack)
          {
            handleLines(detectLocation(player), player);
          }
    
          stepOver(player);
          winHandler(team);
    
          this.firstTime = false;
          canRollDice = true;
        }
      }
    }
  }
}

const select = () => {
  const selectionRelatedStuff = {
    firstTime: true,
    selector: Math.floor(Math.random() * allPlayers.length)
  }

  document.addEventListener("keydown", handleInput.bind(selectionRelatedStuff));

  return function()
  {
    selectionRelatedStuff.selector++;

    if(selectionRelatedStuff.selector > allPlayers.length - 1)
    {
      selectionRelatedStuff.selector = 0;
    }

    selectionRelatedStuff.firstTime = true;

    let intervalId = setInterval(() => {
      diceface(Math.ceil(Math.random() * 6), handleVisualOutput(selectionRelatedStuff.selector));
    }, 100);
  
    setTimeout(() => {
      clearInterval(intervalId);
      diceface(rollResult / BLOCK_SIZE, handleVisualOutput(selectionRelatedStuff.selector));
    }, 1000);

    turnSkipperFunction(selectionRelatedStuff.selector);
  }
};

// 54 block to reach winning line

// function for creating the players objects and will be pushed into the playersArray
const createPlayers = (arrayOfPositions, playersArray, id, team, imagePath) => {
  let index = 0;

  for (pos of arrayOfPositions) {
    playersArray.push(
      new Players(pos.x, pos.y, `${id}${index}`, team, `${imagePath}${index}.png`)
    );

    index++;
  }
};

// pop-up div for players selection
const userChoice = [];
const popUpDiv = document.createElement("div");

document.addEventListener("DOMContentLoaded", () => {
  popUpDiv.classList.add("popup");
  popUpDiv.innerHTML = `
    <h2>Welcome to Ludo!</h2>
    <p>This is a simple implementation of the classic Ludo game.</p>
    <h4>Please choose your players:</h4>
    <div class="choose-container">
    <div class="parent">
    <span class="red-player"></span>
    <input class="checkbox" type="checkbox">
    </div>
    <div class="parent">
    <span class="green-player"></span>
    <input class="checkbox" type="checkbox">
    </div>
    <div class="parent">
    <span class="yellow-player"></span>
    <input class="checkbox" type="checkbox">
    </div>
    <div class="parent">
    <span class="blue-player"></span>
    <input class="checkbox" type="checkbox">
    </div>
    </div>
    <div class="button-parent">
    <button class="start-button">Start</button>
    </div>
    <p>Programmed by: Abd Elrahman Nour</p>
    `;
  document.body.appendChild(popUpDiv);
  let playersCount = 0;
  const startButton = document.querySelector(".start-button");
  const checkboxes = document.querySelectorAll(".checkbox");

  // loop for attaching an event listener on the checkboxes
  // the event listener will be called when the checkboxes are clicked
  // which will add/remove the user choice in the userChoice array
  for (let index = 0; index < checkboxes.length; index++) {
    checkboxes[index].addEventListener("click", () => {
      if (checkboxes[index].checked) {
        playersCount++;
        if (
          userChoice.includes(
            checkboxes[index].previousElementSibling.className
          )
        ) {
          return;
        } else {
          userChoice.push(checkboxes[index].previousElementSibling.className);
        }
      } else {
        playersCount--;
        userChoice.splice(
          userChoice.indexOf(
            checkboxes[index].previousElementSibling.className
          ),
          1
        );
      }
    });
  }

  startButton.addEventListener("click", () => {

    // if the players array contains more than two user choices
    // the program will remove the pop-up div and initialize the players that
    // the user has chosen otherwise it will abort the initialization
    if (playersCount >= 2) {
      if(localStorage.getItem("don't-show-again") !== "true")
      {
        popUpDiv.innerHTML = `<h1>Instructions</h1>
        <p>Instructions are simple all what you got to do is to press the "Enter" key on the keyboard and the dice will roll
        and then choose one of the four players using one of the following numbers 1, 2, 3 or 4 they are also on the keyboard
        </p>
        <h1>Winning</h1>
        <p>If you want to win you got to make one of the four players reach the base door or block, then a pop-up
        will appear with the color of your team indicating your victory!</p>
        <button class="ok-button">OK</button>
        <div class="do-not-show-container">
        <p>Don't show this instructions menu again?</p>
        <input class="do-not-show-checkbox" type="checkbox">
        </div>`;
        const okButton = document.querySelector(".ok-button");
        doNotShowCheckbox = document.querySelector(".do-not-show-checkbox");

        okButton.addEventListener("click", function()
        {
          document.body.removeChild(popUpDiv);
          selectInstance = select();
          canRollDice = true;
        });

        doNotShowCheckbox.addEventListener("click", function()
        {
          doNotShow = doNotShow === false ? true : false;
          localStorage.setItem("don't-show-again", String(doNotShow));
        });
      }
      else
      {
        document.body.removeChild(popUpDiv);
          selectInstance = select();
          canRollDice = true;
      }

      if (userChoice.includes("red-player")) {
        createPlayers(
          PLAYERS_INITIAL_POSITIONS[0],
          redPlayers,
          "red-player",
          "red",
          "assets/images/red_ludo_token"
        );
        allPlayers.push({
          won: false,
          name: "Team Red",
          arrayOfPlayers: redPlayers
        });
      }

      if (userChoice.includes("green-player")) {
        createPlayers(
          PLAYERS_INITIAL_POSITIONS[1],
          greenPlayers,
          "green-player",
          "green",
          "assets/images/green_ludo_token"
        );
        allPlayers.push({
          won: false,
          name: "Team Green",
          arrayOfPlayers: greenPlayers
        });
      }

      if (userChoice.includes("yellow-player")) {
        createPlayers(
          PLAYERS_INITIAL_POSITIONS[2],
          yellowPlayers,
          "yellow-player",
          "yellow",
          "assets/images/yellow_ludo_token"
        );
        allPlayers.push({
          won: false,
          name: "Team Yellow",
          arrayOfPlayers: yellowPlayers
        });
      }

      if (userChoice.includes("blue-player")) {
        createPlayers(
          PLAYERS_INITIAL_POSITIONS[3],
          bluePlayers,
          "blue-player",
          "blue",
          "assets/images/blue_ludo_token"
        );
        allPlayers.push({
          won: false,
          name: "Team Blue",
          arrayOfPlayers: bluePlayers
        });
      }
    } else {
      alert("Please select two players at least!");
    }
  });
});

// players drawing function
const drawPlayers = (arrayOfPlayers) => {
  arrayOfPlayers.forEach((player) => {
    player.draw();
  });
};

// two functions that outputs the result of the diceRollingHandler() function
// and plays a simple animation
const handleVisualOutput = (selector) =>
{
  if(allPlayers[selector].arrayOfPlayers === redPlayers) { return 0; }
  else if(allPlayers[selector].arrayOfPlayers === greenPlayers) { return 2; }
  else if(allPlayers[selector].arrayOfPlayers === yellowPlayers) { return 3; }
  else if(allPlayers[selector].arrayOfPlayers === bluePlayers) { return 1; }
};

const diceface = (value, index) => {
  switch (value) {
    case 1: 
      visualOutput[index].src = "assets/images/dice_face_one.png";
      break;
    case 2:
      visualOutput[index].src = "assets/images/dice_face_two.png";
      break;
    case 3:
      visualOutput[index].src = "assets/images/dice_face_three.png";
      break;
    case 4:
      visualOutput[index].src = "assets/images/dice_face_four.png";
      break;
    case 5:
      visualOutput[index].src = "assets/images/dice_face_five.png";
      break;
    case 6:
      visualOutput[index].src = "assets/images/dice_face_six.png";
      break;
  }
};

// position detection
const detectLocation = (player) => {
  if (player.x >= 0 && player.x <= 300 && player.y === 300) return "line0";
  if (player.x === 300 && player.y <= 250 && player.y >= 0) return "line1";
  if (player.y === 0 && player.x >= 300 && player.x <= 400) return "line2";
  if (player.x === 400 && player.y >= 0 && player.y <= 300) return "line3";
  if (player.y === 300 && player.x >= 450 && player.x <= 700) return "line4";
  if (player.x === 700 && player.y >= 300 && player.y <= 400) return "line5";
  if (player.y === 400 && player.x <= 700 && player.x >= 400) return "line6";
  if (player.x === 400 && player.y >= 450 && player.y <= 700) return "line7";
  if (player.y === 700 && player.x <= 400 && player.x >= 300) return "line8";
  if (player.x === 300 && player.y <= 700 && player.y >= 400) return "line9";
  if (player.y === 400 && player.x <= 300 && player.x >= 0) return "line10";
  if (player.x === 0 && player.y <= 400 && player.y >= 300) return "line11";
};

// handle the player movement based on their position and the dice result
const handleLines = (line, player) => {
  switch (line) {
    case "line0":
      xPossibleMoves = 300;
      xPossibleMoves -= player.x;
      if (rollResult >= xPossibleMoves) {
        player.x += xPossibleMoves;
        player.y -= BLOCK_SIZE;
        player.y -= rollResult - xPossibleMoves;
      } else {
        player.x += rollResult;
      }
      break;
    case "line1":
      yPossibleMoves = player.y;
      if (rollResult >= yPossibleMoves) {
        player.y -= yPossibleMoves;
        xPossibleMoves = 400;
        xPossibleMoves -= player.x;
        if (rollResult - yPossibleMoves >= xPossibleMoves) {
          player.x += xPossibleMoves;
          player.y += rollResult - yPossibleMoves - xPossibleMoves;
        } else {
          player.x += rollResult - yPossibleMoves;
        }
      } else {
        player.y -= rollResult;
      }
      break;
    case "line2":
      xPossibleMoves = 400;
      xPossibleMoves -= player.x;
      if (rollResult >= xPossibleMoves) {
        player.x += xPossibleMoves;
        player.y += rollResult - xPossibleMoves;
      } else {
        player.x += rollResult;
      }
      break;
    case "line3":
      yPossibleMoves = 300;
      yPossibleMoves -= player.y;
      if (rollResult >= yPossibleMoves) {
        player.y += yPossibleMoves;
        player.x += BLOCK_SIZE;
        player.x += rollResult - yPossibleMoves;
      } else {
        player.y += rollResult;
      }
      break;
    case "line4":
      xPossibleMoves = 700;
      xPossibleMoves -= player.x;
      if (rollResult >= xPossibleMoves) {
        player.x += xPossibleMoves;
        yPossibleMoves = 400;
        yPossibleMoves -= player.y;
        if (rollResult - xPossibleMoves >= yPossibleMoves) {
          player.y += yPossibleMoves;
          player.x -= rollResult - xPossibleMoves - yPossibleMoves;
        } else {
          player.y += rollResult - xPossibleMoves;
        }
      } else {
        player.x += rollResult;
      }
      break;
    case "line5":
      yPossibleMoves = 400;
      yPossibleMoves -= player.y;
      if (rollResult >= yPossibleMoves) {
        player.y += yPossibleMoves;
        player.x -= rollResult - yPossibleMoves;
      } else {
        player.y += rollResult;
      }
      break;
    case "line6":
      xPossibleMoves = -300;
      xPossibleMoves += player.x - 100;
      if (rollResult >= xPossibleMoves) {
        player.x -= xPossibleMoves;
        player.y += BLOCK_SIZE;
        player.y += rollResult - xPossibleMoves;
      } else {
        player.x -= rollResult;
      }
      break;
    case "line7":
      yPossibleMoves = 700;
      yPossibleMoves -= player.y;
      if (rollResult >= yPossibleMoves) {
        xPossibleMoves = -100;
        xPossibleMoves += player.x - 200;
        player.y += yPossibleMoves;
        if (rollResult - yPossibleMoves >= xPossibleMoves) {
          player.x -= xPossibleMoves;
          player.y -= rollResult - yPossibleMoves - xPossibleMoves;
        } else {
          player.x -= rollResult - yPossibleMoves;
        }
      } else {
        player.y += rollResult;
      }
      break;
    case "line8":
      xPossibleMoves = -100;
      xPossibleMoves += player.x - 200;
      if (rollResult >= xPossibleMoves) {
        player.x -= xPossibleMoves;
        player.y -= rollResult - xPossibleMoves;
      } else {
        player.x -= rollResult;
      }
      break;
    case "line9":
      yPossibleMoves = -300;
      yPossibleMoves += player.y - 100;
      if (rollResult >= yPossibleMoves) {
        player.y -= yPossibleMoves;
        player.x -= BLOCK_SIZE;
        player.x -= rollResult - yPossibleMoves;
      } else {
        player.y -= rollResult;
      }
      break;
    case "line10":
      xPossibleMoves = player.x;
      if (rollResult >= xPossibleMoves) {
        player.x -= xPossibleMoves;
        yPossibleMoves = -100;
        yPossibleMoves += player.y - 200;
        if (rollResult - xPossibleMoves >= yPossibleMoves) {
          player.y -= yPossibleMoves;
          player.x += rollResult - xPossibleMoves - yPossibleMoves;
        } else {
          player.y -= rollResult - xPossibleMoves;
        }
      } else {
        player.x -= rollResult;
      }
      break;
    case "line11":
      yPossibleMoves = -100;
      yPossibleMoves += player.y - 200;
      if (rollResult >= yPossibleMoves) {
        player.y -= yPossibleMoves;
        player.x += rollResult - yPossibleMoves;
      } else {
        player.y -= rollResult;
      }
      break;
  }
};

function keyUpHandler(event)
{
  if(event.key === "Enter")
  {
    isKeyPressed = false;
  }
}

function diceRollingHandler(event)
{
  if(event.key === "Enter" && canRollDice && !isKeyPressed)
  {
    isKeyPressed = true;
    DICE_SOUND_EFFECT.currentTime = 0;
    DICE_SOUND_EFFECT.play();
    rollResult = Math.ceil(Math.random() * 6);
    rollResult *= 50;
    selectInstance();
  }
}

document.addEventListener("keyup", keyUpHandler);
document.addEventListener("keydown", diceRollingHandler);

// define the game loop function
const drawGame = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBases(true, 0, "red");

  drawBases(true, 1, "limegreen");
  drawBases(true, 2, "yellow");

  drawBases(true, 3, "#00BFFF");
  drawBases(false, 4, "red", 300, BLOCK_SIZE);

  drawBases(false, 5, "limegreen", BLOCK_SIZE, 300);
  drawBases(false, 6, "yellow", 300, BLOCK_SIZE);

  drawBases(false, 7, "#00BFFF", BLOCK_SIZE, 300);
  drawBases(false, 8, "red", BLOCK_SIZE, 100);

  drawBases(false, 9, "limegreen", 100, BLOCK_SIZE);
  drawBases(false, 10, "yellow", BLOCK_SIZE, 100);

  drawBases(false, 11, "#00BFFF", 100, BLOCK_SIZE);
  drawBases(false, 12, "red", BLOCK_SIZE, BLOCK_SIZE);

  drawBases(false, 13, "limegreen", BLOCK_SIZE, BLOCK_SIZE);
  drawBases(false, 14, "yellow", BLOCK_SIZE, BLOCK_SIZE);

  drawBases(false, 15, "#00BFFF", BLOCK_SIZE, BLOCK_SIZE);
  drawHorizontalBorders();

  drawVerticalBorders();
  drawPlayers(redPlayers);

  drawPlayers(greenPlayers);
  drawPlayers(yellowPlayers);

  drawPlayers(bluePlayers);
  drawSafeAreas();

  requestAnimationFrame(drawGame);
};

// start the game loop
drawGame();

// just a debugging function
/*setInterval(function()
{
  if(allPlayers.length > 0)
  {
    for(let i = 0; i < allPlayers.length; i++)
    {
      for(let j = 0; j < 4; j++)
      {
        console.log(`${allPlayers[i].arrayOfPlayers[j].id}: ${allPlayers[i].arrayOfPlayers[j].totalMoves}`);
      }
    }
  }
  console.log("\n");
}, 5000);*/