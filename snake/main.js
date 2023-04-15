import { update as updateSnake, draw as drawSnake, Snake_Speed, getSnakeHead, snakeIntersection, score } from "./snake.js"
import { update as updateFood, draw as drawFood } from "./food.js"
import { outsideGrid } from "./grid.js"

let lastRenderTime = 0;
let gameOver = false;
let golden = false;
const gameBoard = document.getElementById("game-board");

let main = (currentTime) => {
    if (gameOver) {
        if (confirm('Game Over! Good Try! Press OK to Restart')) {
            window.location.reload();
        }
        return
    }

    window.requestAnimationFrame(main);
    const secondsSinceLastRender = (currentTime - lastRenderTime) / 1000;
    if (secondsSinceLastRender < 1 / Snake_Speed) {
        return
    }

    lastRenderTime = currentTime;
    // Breaks game into 2 parts
    update(); // Updates if snake moved, lost, increased size, etc
    draw(); // Takes info from Update, and draws it so user can see visually
}

window.requestAnimationFrame(main);

let update = () => {
    updateSnake();
    updateFood(golden);
    checkForDeath();
}

let draw = () => {
    gameBoard.innerHTML = ''
    drawSnake(gameBoard);
    drawFood(gameBoard, golden);
    document.getElementById('score').innerHTML = `Score: ${score()}`;
}

function checkForDeath() {
    gameOver = outsideGrid(getSnakeHead()) || snakeIntersection();
}

// Button
let goldenToggle = document.querySelector('input[name="G-apple"]');

goldenToggle.addEventListener('change', function() {
  if (this.checked) {
    golden = true;
  } else {
    golden = false;
  }
});