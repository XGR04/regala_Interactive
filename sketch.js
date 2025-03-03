let rows = 3;
let cols = 5;
let cellSize = 25;
let startX = 200;
let startY = 230;
let gridStates = [];

let playerX = 100;
let playerY = 250;
let moveSpeed = 20;

let dayCount = 0;
let requiredDays = 3;
let cropsCollected = 0;

function setup() {
  createCanvas(400, 400);
  for (let i = 0; i < rows; i++) {
    gridStates[i] = [];
    for (let j = 0; j < cols; j++) {
      gridStates[i][j] = 0;
    }
  }
}

function draw() {
  strokeWeight(0.2);
  background('#7ac74f');
  house();
  farmland();
  
  if (isAllPlanted()) {
    waterDrop();
  }
  
  player();
  displaySleepMsg();
  displayStats();
}

function house() {
  fill('#e84a4a');
  rect(50, 100, 120, 80);
  
  fill('#8b3e2f');
  triangle(40, 100, 110, 50, 180, 100);
  rect(40, 100, 140, 25);
  
  fill('#a64b3f');
  rect(90, 140, 40, 40);
}

function farmland() {
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      let x = startX + j * cellSize;
      let y = startY + i * cellSize;
      stroke(0);
      
      if (gridStates[i][j] === 0) {
        fill('#895129');
        rect(x, y, cellSize, cellSize);
      } else if (gridStates[i][j] === 1) {
        fill('#895129');
        rect(x, y, cellSize, cellSize);
        fill('white');
        ellipse(x + cellSize / 2, y + cellSize / 2, cellSize * 0.8);
      } else if (gridStates[i][j] === 2) {
        fill('lightblue');
        rect(x, y, cellSize, cellSize);
      } else if (gridStates[i][j] === 3) {
        fill('#895129');
        rect(x, y, cellSize, cellSize);
        fill('orange');
        triangle(
          x + cellSize / 2, y + cellSize * 0.2,
          x + cellSize * 0.2, y + cellSize * 0.8,
          x + cellSize * 0.8, y + cellSize * 0.8
        );
      }
    }
  }
}

function player() {
  fill('darkblue');
  rect(playerX, playerY, 15, 25, 10);
  fill('salmon');
  ellipse(playerX + 7, playerY, 20);
}

function displaySleepMsg() {
  if (isPlayerAtDoor()) {
    fill(255, 255, 255, 200);
    rect(10, 10, width - 20, 30);
    fill(0);
    textSize(16);
    textAlign(CENTER, CENTER);
    text("Press S to sleep", width / 2, 10 + 30 / 2);
  }
}

function displayStats() {
  fill('black');
  textSize(16);
  textAlign(RIGHT, BOTTOM);
  text("Days: " + dayCount + "   Crops Collected: " + cropsCollected, width - 10, height - 10);
}

function isPlayerAtDoor() {
  return (playerX >= 90 && playerX <= 130 && playerY >= 140 && playerY <= 180);
}

function isAllPlanted() {
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      if (gridStates[i][j] !== 1) {
        return false;
      }
    }
  }
  return true;
}

function isFarmEmpty() {
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      if (gridStates[i][j] !== 0) {
        return false;
      }
    }
  }
  return true;
}

function isAllHarvestable() {
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      if (gridStates[i][j] !== 0 && gridStates[i][j] !== 3) {
        return false;
      }
    }
  }
  return true;
}

function waterDrop() {
  let farmlandCenterX = startX + (cols * cellSize) / 2;
  let farmlandTopY = startY;
  let baseOffset = 30;
  let dropY = farmlandTopY - baseOffset;
  
  push();
  noStroke();
  fill('blue');
  ellipse(farmlandCenterX, dropY, 20, 25);
  triangle(
    farmlandCenterX - 10, dropY + 5,
    farmlandCenterX + 10, dropY + 5,
    farmlandCenterX, dropY + 20
  );
  pop();
}

function keyPressed() {
  if (key === 'w' || key === 'W') {
    playerY -= moveSpeed;
  }
  if (key === 'a' || key === 'A') {
    playerX -= moveSpeed;
  }
  if (key === 's' || key === 'S') {
    if (isPlayerAtDoor()) {
      if (isFarmEmpty() || isAllHarvestable() || !isFarmReadyForSleep()) {
        playerY += moveSpeed;
      } else {
        dayCount++;
        console.log("Day: " + dayCount);
        if (dayCount >= requiredDays) {
          for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
              if (gridStates[i][j] === 2) {
                gridStates[i][j] = 3;
              }
            }
          }
        }
      }
    } else {
      playerY += moveSpeed;
    }
  }
  if (key === 'd' || key === 'D') {
    playerX += moveSpeed;
  }
}

function isFarmReadyForSleep() {
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      if (gridStates[i][j] === 1 || gridStates[i][j] === 0) {
        return false;
      }
    }
  }
  return true;
}

function mousePressed() {
  if (isAllPlanted()) {
    let farmlandCenterX = startX + (cols * cellSize) / 2;
    let farmlandTopY = startY;
    let baseOffset = 30;
    let dropY = farmlandTopY - baseOffset;
    let left = farmlandCenterX - 10;
    let right = farmlandCenterX + 10;
    let top = dropY - 12.5;
    let bottom = dropY + 20;
    if (mouseX > left && mouseX < right && mouseY > top && mouseY < bottom) {
      for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
          if (gridStates[i][j] === 1) {
            gridStates[i][j] = 2;
          }
        }
      }
      console.log("Crops watered!");
      return;
    }
  }
  
  if (!isPlayerAtDoor()) {
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        let x = startX + j * cellSize;
        let y = startY + i * cellSize;
        if (mouseX > x && mouseX < x + cellSize &&
            mouseY > y && mouseY < y + cellSize) {
          if (gridStates[i][j] === 0) {
            gridStates[i][j] = 1;
          } else if (gridStates[i][j] === 3) {
            gridStates[i][j] = 0;
            cropsCollected++;
            console.log("Crop harvested!");
          }
        }
      }
    }
  }
}
