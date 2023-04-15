let inputDirection = { x: 0, y: 0 };
let lastInputDirection = { x: 0, y: 0 }; 

window.addEventListener('keydown', e => {
    switch(e.key) {

        case 'ArrowUp':
            if (lastInputDirection.y !== 0) { break }
            inputDirection = { x: 0, y: -1 };
            break;
        case 'ArrowDown':
            if (lastInputDirection.y !== 0) { break }
            inputDirection = { x: 0, y: 1 };
            break;
        case 'ArrowLeft':
            if (lastInputDirection.x !== 0) { break }
            inputDirection = { x: -1, y: 0 };
            break;
        case 'ArrowRight':
            if (lastInputDirection.x !== 0) { break }
            inputDirection = { x: 1, y: 0 };
            break;

        case 'w':
            if (lastInputDirection.y !== 0) { break }
            inputDirection = { x: 0, y: -1 };
            break;
        case 's':
            if (lastInputDirection.y !== 0) { break }
            inputDirection = { x: 0, y: 1 };
            break;
        case 'a':
            if (lastInputDirection.x !== 0) { break }
            inputDirection = { x: -1, y: 0 };
            break;
        case 'd':
            if (lastInputDirection.x !== 0) { break }
            inputDirection = { x: 1, y: 0 };
            break;

    }
});



export function getInputDirection() {
    lastInputDirection = inputDirection;
    return inputDirection
}


// Buttons
let upBtn = document.getElementById('up');
let leftBtn = document.getElementById('left');
let rightBtn = document.getElementById('right');
let downBtn = document.getElementById('down');

// Movement for mobile players
upBtn.onclick = () => {
    if (lastInputDirection.y !== 0) { 
        return
    }
    inputDirection = { x: 0, y: -1 };
    return
}

leftBtn.onclick = () => {
    if (lastInputDirection.x !== 0) { 
        return
    }
    inputDirection = { x: -1, y: 0 };
    return
}

rightBtn.onclick = () => {
    if (lastInputDirection.x !== 0) { 
        return
    }
    inputDirection = { x: 1, y: 0 };
    return
}

downBtn.onclick = () => {
    if (lastInputDirection.y !== 0) { 
        return
    }
    inputDirection = { x: 0, y: 1 };
    return
}