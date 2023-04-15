import { onSnake, expandSnake } from "./snake.js"
import { randomGridPosition } from "./grid.js";

let food = randomFoodPosition()
let goldFood = randomFoodPosition()
const Expansion_Rate = 1;

export let update = (gold = false) => {
    if (onSnake(food)) {
        expandSnake(Expansion_Rate)
        food = randomFoodPosition();
    }
    if (gold) {
        if (onSnake(goldFood)) {
            expandSnake(Expansion_Rate * 3)
            goldFood = randomFoodPosition();
        }
    }
}

export let draw = (gameBoard, gold = false) => {
    const foodElement = document.createElement('div')
    foodElement.style.gridRowStart = food.y
    foodElement.style.gridColumnStart = food.x
    foodElement.classList.add('food')
    gameBoard.appendChild(foodElement) 

    if (gold) {
        const goldfoodElement = document.createElement('div')
        goldfoodElement.style.gridRowStart = goldFood.y
        goldfoodElement.style.gridColumnStart = goldFood.x
        goldfoodElement.classList.add('food-gold')
        gameBoard.appendChild(goldfoodElement) 
    }
}

function randomFoodPosition() {
    let newFoodPosition;
    while (newFoodPosition == null || onSnake(newFoodPosition)) {
        newFoodPosition = randomGridPosition()
    }

    return newFoodPosition
}

