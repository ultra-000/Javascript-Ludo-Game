// Initializing the game

/** @type {HTMLCanvasElement} */
const canvas = document.getElementById("playground");
/** @type {CanvasRenderingContext2D} */
const ctx = canvas.getContext("2d");
const output = document.getElementById("output");
const visualOutput = document.querySelectorAll(".visual-output");
const DICE_SOUND_EFFECT = new Audio(
  "assets/sound effects/dice_sound_effect.mp3"
);

canvas.width = 750;
canvas.height = 750;

const BLOCK_SIZE = 50;
let horizontalBordersAmount = canvas.width / 50;
let verticalBordersAmount = canvas.height / 50;

let xPossibleMoves;
let yPossibleMoves;
let rollResult;
const maxMovesOnTrack = 2500;
const maxMovesToWin = 300;

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

// Initializing the players

class Players {
  constructor(x, y, id, imagSrc) {
    this.x = x;
    this.y = y;
    this.width = BLOCK_SIZE;
    this.height = BLOCK_SIZE;
    this.image = new Image();
    this.image.src = imagSrc;
    this.id = id;
    this.totalMoves = 0;
    this.isTurn = false;
    this.inBase = true;
    this.onTrack = false;
    this.hasWon = false;
  }
  draw() {
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

// function for creating the players objects and will be pushed into the playersArray

const createPlayers = (arrayOfPositions, playersArray, id, imagePath) => {
  let index = 0;
  for (pos of arrayOfPositions) {
    playersArray.push(new Players(pos.x, pos.y, `${id}${index}`, imagePath));
    index++;
  }
};

// pop up div for players selection

const popUpDiv = document.createElement("div");
document.addEventListener("DOMContentLoaded", () => {
  popUpDiv.classList.add("popup");
  popUpDiv.innerHTML = `
    <h2>Welcome to Ludo!</h2>
    <p>This is a simple implementation of the classic Ludo game.</p>
    <h4>Please choose your plyers:</h4>
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
    `;
  document.body.appendChild(popUpDiv);
  let userChoice = [];
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
      console.log(playersCount);
      console.log(userChoice);
    });
  }

  startButton.addEventListener("click", () => {
    // if the players array contains more than two user choices
    // we will remove the pop up div and initialize the players
    // that the user has chosen otherwise we will abort the initialization

    if (playersCount >= 2) {
      document.body.removeChild(popUpDiv);
      if (userChoice.includes("red-player")) {
        createPlayers(
          PLAYERS_INITIAL_POSITIONS[0],
          redPlayers,
          "red-player",
          "assets/images/red_ludo_token0.png"
        );
        console.log(redPlayers);
      }
      if (userChoice.includes("green-player")) {
        createPlayers(
          PLAYERS_INITIAL_POSITIONS[1],
          greenPlayers,
          "green-player",
          "assets/images/green_ludo_token0.png"
        );
      }
      if (userChoice.includes("yellow-player")) {
        createPlayers(
          PLAYERS_INITIAL_POSITIONS[2],
          yellowPlayers,
          "yellow-player",
          "assets/images/yellow_ludo_token0.png"
        );
      }
      if (userChoice.includes("blue-player")) {
        createPlayers(
          PLAYERS_INITIAL_POSITIONS[3],
          bluePlayers,
          "blue-player",
          "assets/images/blue_ludo_token0.png"
        );
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

// main logic

// a function that outputs the result of the rollDice() function
// and plays a simple animation

const diceface = (value) => {
  switch (value) {
    case 1:
      visualOutput[0].src = "assets/images/dice_face_one.png";
      break;
    case 2:
      visualOutput[0].src = "assets/images/dice_face_two.png";
      break;
    case 3:
      visualOutput[0].src = "assets/images/dice_face_three.png";
      break;
    case 4:
      visualOutput[0].src = "assets/images/dice_face_four.png";
      break;
    case 5:
      visualOutput[0].src = "assets/images/dice_face_five.png";
      break;
    case 6:
      visualOutput[0].src = "assets/images/dice_face_six.png";
      break;
  }
};

// position detection

const detectLocation = () => {
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

const handleLines = (line) => {
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

const rollDice = () => {
  DICE_SOUND_EFFECT.play();
  rollResult = Math.ceil(Math.random() * 6);
  rollResult *= 50;
  player.totalMoves += rollResult;
  console.log(player.totalMoves);
  let intervalId = setInterval(() => {
    diceface(Math.ceil(Math.random() * 6));
  }, 100);

  setTimeout(() => {
    clearInterval(intervalId);
    diceface(rollResult / BLOCK_SIZE);
    handleLines(detectLocation());
  }, 500);
};

document.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    rollDice();
  }
});

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
  requestAnimationFrame(drawGame);
};

// start the game loop

drawGame();
