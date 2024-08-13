/** @type {HTMLCanvasElement} */
const canvas = document.getElementById("playground");
/** @type {CanvasRenderingContext2D} */
const ctx = canvas.getContext("2d");
const output = document.getElementById("output");

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

const visualOutput = document.querySelectorAll(".visual-output");
const DICE_SOUND_EFFECT = new Audio(
  "assets/sound effects/dice_sound_effect.mp3"
);

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

const drawHorizontalBorders = () => {
  for (let index = 0; index < horizontalBordersAmount; index++) {
    ctx.beginPath();
    ctx.fillStyle = "black";
    ctx.rect(index * 50, 0, 1, canvas.height);
    ctx.fill();
    ctx.closePath();
  }
};

const drawVerticalBorders = () => {
  for (let index = 0; index < verticalBordersAmount; index++) {
    ctx.beginPath();
    ctx.fillStyle = "black";
    ctx.rect(0, index * 50, canvas.width, 1);
    ctx.fill();
    ctx.closePath();
  }
};

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

const player = new Players(
  50,
  300,
  "redToken1",
  "assets/images/red_ludo_token1.png"
);

const player2 = new Players(
  150 / 2,
  350 / 2,
  "redToken2",
  "assets/images/red_ludo_token1.png"
);

const player3 = new Players(
  350 / 2,
  150 / 2,
  "redToken3",
  "assets/images/red_ludo_token1.png"
);

const player4 = new Players(
  350 / 2,
  350 / 2,
  "redToken4",
  "assets/images/red_ludo_token1.png"
);

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

const drawGame = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBases(true, 0, "red");
  drawBases(true, 1, "limegreen");
  drawBases(true, 2, "yellow");
  drawBases(true, 3, "#00BFFF");
  drawHorizontalBorders();
  drawVerticalBorders();
  if (player.totalMoves > maxMovesOnTrack) {
    player.x = 0;
    player.y = 350;
    player.x += player.totalMoves - maxMovesOnTrack;
  }
  player.draw();
  player2.draw();
  player3.draw();
  player4.draw();
  requestAnimationFrame(drawGame);
};

drawGame();
