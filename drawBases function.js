const drawBases = () => {
  // red base begins
  ctx.beginPath();
  ctx.fillStyle = "red";
  ctx.rect(BLOCK_SIZE, 300, BLOCK_SIZE, BLOCK_SIZE);
  ctx.fill();
  ctx.closePath();

  ctx.beginPath();
  ctx.fillStyle = "red";
  ctx.rect(300, 400, BLOCK_SIZE, BLOCK_SIZE);
  ctx.fill();
  ctx.closePath();

  for (let index = 0; index < 6; index++) {
    ctx.beginPath();
    ctx.fillStyle = "red";
    ctx.rect(50 + index * 50, 350, BLOCK_SIZE, BLOCK_SIZE);
    ctx.fill();
    ctx.closePath();
  }

  for (let index = 0; index < 6; index++) {
    ctx.beginPath();
    ctx.fillStyle = "red";
    ctx.rect(index * 50, 0, BLOCK_SIZE, BLOCK_SIZE);
    ctx.fill();
    ctx.closePath();
  }
  for (let index = 0; index < 6; index++) {
    ctx.beginPath();
    ctx.fillStyle = "red";
    ctx.rect(0, index * 50, BLOCK_SIZE, BLOCK_SIZE);
    ctx.fill();
    ctx.closePath();
  }
  for (let index = 0; index < 6; index++) {
    ctx.beginPath();
    ctx.fillStyle = "red";
    ctx.rect(250, index * 50, BLOCK_SIZE, BLOCK_SIZE);
    ctx.fill();
    ctx.closePath();
  }
  for (let index = 0; index < 6; index++) {
    ctx.beginPath();
    ctx.fillStyle = "red";
    ctx.rect(index * 50, 250, BLOCK_SIZE, BLOCK_SIZE);
    ctx.fill();
    ctx.closePath();
  }
  // red base ends

  // green base begins
  ctx.beginPath();
  ctx.fillStyle = "limegreen";
  ctx.rect(400, 50, BLOCK_SIZE, BLOCK_SIZE);
  ctx.fill();
  ctx.closePath();

  ctx.beginPath();
  ctx.fillStyle = "limegreen";
  ctx.rect(300, 300, BLOCK_SIZE, BLOCK_SIZE);
  ctx.fill();
  ctx.closePath();

  for (let index = 0; index < 6; index++) {
    ctx.beginPath();
    ctx.fillStyle = "limegreen";
    ctx.rect(350, 50 + index * 50, BLOCK_SIZE, BLOCK_SIZE);
    ctx.fill();
    ctx.closePath();
  }

  for (let index = 0; index < 6; index++) {
    ctx.beginPath();
    ctx.fillStyle = "limegreen";
    ctx.rect(450 + index * 50, 0, BLOCK_SIZE, BLOCK_SIZE);
    ctx.fill();
    ctx.closePath();
  }
  for (let index = 0; index < 6; index++) {
    ctx.beginPath();
    ctx.fillStyle = "limegreen";
    ctx.rect(450, index * 50, BLOCK_SIZE, BLOCK_SIZE);
    ctx.fill();
    ctx.closePath();
  }
  for (let index = 0; index < 6; index++) {
    ctx.beginPath();
    ctx.fillStyle = "limegreen";
    ctx.rect(450 + index * 50, 250, BLOCK_SIZE, BLOCK_SIZE);
    ctx.fill();
    ctx.closePath();
  }
  for (let index = 0; index < 6; index++) {
    ctx.beginPath();
    ctx.fillStyle = "limegreen";
    ctx.rect(700, index * 50, BLOCK_SIZE, BLOCK_SIZE);
    ctx.fill();
    ctx.closePath();
  }
  // green base ends

  // yellow base begins
  ctx.beginPath();
  ctx.fillStyle = "yellow";
  ctx.rect(650, 400, BLOCK_SIZE, BLOCK_SIZE);
  ctx.fill();
  ctx.closePath();

  ctx.beginPath();
  ctx.fillStyle = "yellow";
  ctx.rect(400, 300, BLOCK_SIZE, BLOCK_SIZE);
  ctx.fill();
  ctx.closePath();

  for (let index = 0; index < 6; index++) {
    ctx.beginPath();
    ctx.fillStyle = "yellow";
    ctx.rect(400 + index * 50, 350, BLOCK_SIZE, BLOCK_SIZE);
    ctx.fill();
    ctx.closePath();
  }

  for (let index = 0; index < 6; index++) {
    ctx.beginPath();
    ctx.fillStyle = "yellow";
    ctx.rect(450 + index * 50, 450, BLOCK_SIZE, BLOCK_SIZE);
    ctx.fill();
    ctx.closePath();
  }
  for (let index = 0; index < 6; index++) {
    ctx.beginPath();
    ctx.fillStyle = "yellow";
    ctx.rect(700, 450 + index * 50, BLOCK_SIZE, BLOCK_SIZE);
    ctx.fill();
    ctx.closePath();
  }
  for (let index = 0; index < 6; index++) {
    ctx.beginPath();
    ctx.fillStyle = "yellow";
    ctx.rect(450 + index * 50, 700, BLOCK_SIZE, BLOCK_SIZE);
    ctx.fill();
    ctx.closePath();
  }
  for (let index = 0; index < 6; index++) {
    ctx.beginPath();
    ctx.fillStyle = "yellow";
    ctx.rect(450, 450 + index * 50, BLOCK_SIZE, BLOCK_SIZE);
    ctx.fill();
    ctx.closePath();
  }
  // yellow base ends

  // blue base begins
  ctx.beginPath();
  ctx.fillStyle = "#00BFFF";
  ctx.rect(300, 650, BLOCK_SIZE, BLOCK_SIZE);
  ctx.fill();
  ctx.closePath();

  ctx.beginPath();
  ctx.fillStyle = "#00BFFF";
  ctx.rect(400, 400, BLOCK_SIZE, BLOCK_SIZE);
  ctx.fill();
  ctx.closePath();

  for (let index = 0; index < 6; index++) {
    ctx.beginPath();
    ctx.fillStyle = "#00BFFF";
    ctx.rect(350, 400 + index * 50, BLOCK_SIZE, BLOCK_SIZE);
    ctx.fill();
    ctx.closePath();
  }

  for (let index = 0; index < 6; index++) {
    ctx.beginPath();
    ctx.fillStyle = "#00BFFF";
    ctx.rect(index * 50, 450, BLOCK_SIZE, BLOCK_SIZE);
    ctx.fill();
    ctx.closePath();
  }
  for (let index = 0; index < 6; index++) {
    ctx.beginPath();
    ctx.fillStyle = "#00BFFF";
    ctx.rect(index * BLOCK_SIZE, 700, BLOCK_SIZE, BLOCK_SIZE);
    ctx.fill();
    ctx.closePath();
  }
  for (let index = 0; index < 6; index++) {
    ctx.beginPath();
    ctx.fillStyle = "#00BFFF";
    ctx.rect(0, 450 + index * 50, BLOCK_SIZE, BLOCK_SIZE);
    ctx.fill();
    ctx.closePath();
  }
  for (let index = 0; index < 6; index++) {
    ctx.beginPath();
    ctx.fillStyle = "#00BFFF";
    ctx.rect(250, 450 + index * 50, BLOCK_SIZE, BLOCK_SIZE);
    ctx.fill();
    ctx.closePath();
  }
  // blue base ends

  // white spot begins
  ctx.beginPath();
  ctx.fillStyle = "white";
  ctx.rect(350, 350, BLOCK_SIZE, BLOCK_SIZE);
  ctx.fill();
  ctx.closePath();
  // white spot ends
};
