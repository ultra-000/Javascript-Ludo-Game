const drawRectangles = (color, positions) => {
  ctx.fillStyle = color;
  positions.forEach(([x, y]) => {
    ctx.beginPath();
    ctx.rect(x, y, BLOCK_SIZE, BLOCK_SIZE);
    ctx.fill();
    ctx.closePath();
  });
};

const drawBases = () => {
  // Red base
  drawRectangles("red", [
    [BLOCK_SIZE, 300],
    [300, 400],
    ...Array.from({ length: 6 }, (_, index) => [50 + index * 50, 350]),
    ...Array.from({ length: 6 }, (_, index) => [index * 50, 0]),
    ...Array.from({ length: 6 }, (_, index) => [0, index * 50]),
    ...Array.from({ length: 6 }, (_, index) => [250, index * 50]),
    ...Array.from({ length: 6 }, (_, index) => [index * 50, 250]),
  ]);

  // Green base
  drawRectangles("limegreen", [
    [400, 50],
    [300, 300],
    ...Array.from({ length: 6 }, (_, index) => [350, 50 + index * 50]),
    ...Array.from({ length: 6 }, (_, index) => [450 + index * 50, 0]),
    ...Array.from({ length: 6 }, (_, index) => [450, index * 50]),
    ...Array.from({ length: 6 }, (_, index) => [450 + index * 50, 250]),
    ...Array.from({ length: 6 }, (_, index) => [700, index * 50]),
  ]);

  // Yellow base
  drawRectangles("yellow", [
    [650, 400],
    [400, 300],
    ...Array.from({ length: 6 }, (_, index) => [400 + index * 50, 350]),
    ...Array.from({ length: 6 }, (_, index) => [450 + index * 50, 450]),
    ...Array.from({ length: 6 }, (_, index) => [700, 450 + index * 50]),
    ...Array.from({ length: 6 }, (_, index) => [450 + index * 50, 700]),
    ...Array.from({ length: 6 }, (_, index) => [450, 450 + index * 50]),
  ]);

  // Blue base
  drawRectangles("#00BFFF", [
    [300, 650],
    [400, 400],
    ...Array.from({ length: 6 }, (_, index) => [350, 400 + index * 50]),
    ...Array.from({ length: 6 }, (_, index) => [index * 50, 450]),
    ...Array.from({ length: 6 }, (_, index) => [index * BLOCK_SIZE, 700]),
    ...Array.from({ length: 6 }, (_, index) => [0, 450 + index * 50]),
    ...Array.from({ length: 6 }, (_, index) => [250, 450 + index * 50]),
  ]);

  // White spot
  drawRectangles("white", [[350, 350]]);
};
