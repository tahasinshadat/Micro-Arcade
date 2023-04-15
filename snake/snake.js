import { getInputDirection } from "./input.js";

export let Snake_Speed = 5;
const snakeBody = [{ x: 11, y: 11}]
let newSegments = 0;

export let update = () => {
    addSegments();
    const inputDirection = getInputDirection();
    // when the snake moves, make its body follow the movement of the head by going to the heads old spot
    for (let i = snakeBody.length - 2; i >= 0 ;i--) {
        snakeBody[i + 1] = { ...snakeBody[i] };
    }

    snakeBody[0].x += inputDirection.x;
    snakeBody[0].y += inputDirection.y;
}

export let draw = (gameBoard) => {
    snakeBody.forEach(segment => {
        const snakeElement = document.createElement('div')
        snakeElement.style.gridRowStart = segment.y
        snakeElement.style.gridColumnStart = segment.x
        snakeElement.classList.add('snake')
        gameBoard.appendChild(snakeElement)
    });
}

export let expandSnake = (amount) => {
    newSegments += amount
}

export let onSnake = (position, { ignoreHead = false} = {}) => {
    return snakeBody.some( (segment, index) => {
        if (ignoreHead && index === 0) {
            return false
        }
        return equalPositions(segment, position)
    })
}

function equalPositions(pos1, pos2) {
    return pos1.x === pos2.x && pos1.y === pos2.y
}

function addSegments() {
    for (let i = 0; i < newSegments; i++) {
        snakeBody.push( { ...snakeBody[snakeBody.length - 1] } )
    }

    newSegments = 0;
}

export function getSnakeHead() {
    return snakeBody[0];
}

export function snakeIntersection() {
    return onSnake(snakeBody[0], { ignoreHead: true })
}

export function score() {
    return snakeBody.length - 1
}

// Buttons
let resetBtn = document.getElementById('reset');
let easyBtn = document.getElementById('easy');
let mediumBtn = document.getElementById('medium');
let hardBtn = document.getElementById('hard');
easyBtn.style.opacity = 0.75;

resetBtn.onclick = () => {
    window.location.reload();
}

easyBtn.onclick = () => {
    easyBtn.style.opacity = 0.75;
    mediumBtn.style.opacity = 1;
    hardBtn.style.opacity = 1;
    Snake_Speed = 5;
}

mediumBtn.onclick = () => {
    easyBtn.style.opacity = 1;
    mediumBtn.style.opacity = 0.75;
    hardBtn.style.opacity = 1;
    Snake_Speed = 10;
}

hardBtn.onclick = () => {
    easyBtn.style.opacity = 1;
    mediumBtn.style.opacity = 1;
    hardBtn.style.opacity = 0.75;
    Snake_Speed = 15;
}