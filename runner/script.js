// First ever JS Canvas Project
const canvas = document.getElementById('game');



/* 
ctx helps with the drawing => It mimics functions in a similar way
to P5.js
For example: it has predefined functions like p5 has like p5's
ellipse() function and rect() function
- ctx uses something in javascript called inheritence to get/call these
functions
*/
const ctx = canvas.getContext('2d'); // Gets a object from canvas API
// console.log(ctx); <- Used to see functions in console

// Character animations
let runningImages = [
    'images/running/runningNaruto (1).gif', 
    'images/running/runningNaruto (1).gif',
    'images/running/runningNaruto (1).gif',
    'images/running/runningNaruto (1).gif',
    'images/running/runningNaruto (1).gif',
    'images/running/runningNaruto (2).gif', 
    'images/running/runningNaruto (2).gif', 
    'images/running/runningNaruto (2).gif', 
    'images/running/runningNaruto (2).gif',
    'images/running/runningNaruto (2).gif', 
    'images/running/runningNaruto (3).gif',
    'images/running/runningNaruto (3).gif',
    'images/running/runningNaruto (3).gif',
    'images/running/runningNaruto (3).gif',
    'images/running/runningNaruto (3).gif', 
    'images/running/runningNaruto (4).gif',
    'images/running/runningNaruto (4).gif',
    'images/running/runningNaruto (4).gif', 
    'images/running/runningNaruto (4).gif',
    'images/running/runningNaruto (4).gif',  
    'images/running/runningNaruto (5).gif',
    'images/running/runningNaruto (5).gif', 
    'images/running/runningNaruto (5).gif',
    'images/running/runningNaruto (5).gif',
    'images/running/runningNaruto (5).gif',
    'images/running/runningNaruto (6).gif',
    'images/running/runningNaruto (6).gif',
    'images/running/runningNaruto (6).gif',
    'images/running/runningNaruto (6).gif',
    'images/running/runningNaruto (6).gif'
];
let slidingImages = [
    'images/sliding/slideNaruto (1).gif',
    'images/sliding/slideNaruto (1).gif',
    'images/sliding/slideNaruto (1).gif',
    'images/sliding/slideNaruto (1).gif',
    'images/sliding/slideNaruto (1).gif',
    'images/sliding/slideNaruto (2).gif',
    'images/sliding/slideNaruto (2).gif',
    'images/sliding/slideNaruto (2).gif',
    'images/sliding/slideNaruto (2).gif',
    'images/sliding/slideNaruto (2).gif',
];
let jumpingImages = [
    'images/jumping/jumpNaruto (1).gif',
    'images/jumping/jumpNaruto (1).gif',
    'images/jumping/jumpNaruto (1).gif',
    'images/jumping/jumpNaruto (1).gif',
    'images/jumping/jumpNaruto (1).gif',
    'images/jumping/jumpNaruto (2).gif',
    'images/jumping/jumpNaruto (2).gif',
    'images/jumping/jumpNaruto (2).gif',
    'images/jumping/jumpNaruto (2).gif',
    'images/jumping/jumpNaruto (2).gif'
];

// Variables
let scoreText = document.getElementById('scoreText');
let score;
let highscore;
let player;
let gravity;
let obstacles = [];
let gameSpeed;
let keys = {};

function setup() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    canvas.width = window.innerWidth / 1.25;
    canvas.height = 425; 
    ctx.beginPath();
    ctx.fillStyle = 'rgb(0, 255, 0)';
    ctx.fillRect(0, 415, 2000, 10);
    ctx.closePath();
    ctx.drawImage(imageload('images/Standing-Naruto.gif'), 75, 150, 80, 80);
    highscore = 0;
    if (localStorage.getItem('highscore')) {
        highscore = localStorage.getItem('highscore');
    }
    highScoreText.innerHTML = `Highest Score: ${highscore}`;
}

// Event Listeners
document.addEventListener('keydown', function (event) {
    keys[event.code] = true; // Validating the key is in fact down
});

document.addEventListener('keyup', function (event) {
    keys[event.code] = false; // Validating the key is in fact up
});


// Characters / Objects / Classes
class Player {
    constructor (x, y, width, height, color) {
        // Position of the player
        this.x = x;
        this.y = y;

        // Dimensions of the player
        this.width = width;
        this.height = height;

        // Customization of the player
        this.color = color;

        // Players Jump Velocity
        this.velocityY = 0;

        // Amount playuer jumps
        this.jumpForce = 15;

        // Height of player to help with the "ducking"/ "sliding" effect
        this.originalHeight = height;

        // If player is doing certain action
        this.grounded = false;
        this.sliding = false;
        this.jumping = false;

        // How long player is in air
        this.jumpTimer = 0;

        // Animation for character
        this.slideFrameCount = 0;
        this.jumpFrameCount = 0;
        this.runFrameCount = 0;
    }

    // Draws the player
    Draw () {
        if (this.jumping) { // Draws jumping animation
            ctx.drawImage(imageload(jumpingImages[this.jumpFrameCount]), this.x, this.y, this.width, this.height);
            if (this.jumpFrameCount == 9) {
                this.jumpFrameCount = 5;
            } else {
                this.jumpFrameCount++;
            }
        } else if (this.sliding) { // Draws sliding animation
            ctx.drawImage(imageload(slidingImages[this.slideFrameCount]), this.x, this.y, this.width, this.height);
            if (this.slideFrameCount == 9) {
                this.slideFrameCount = 0;
            } else {
                this.slideFrameCount++;
            }
        } else { // Draws running animation
            this.jumpFrameCount = 0;
            ctx.drawImage(imageload(runningImages[this.runFrameCount]), this.x, this.y, this.width, this.height);
            if (this.runFrameCount == 29) {
                this.runFrameCount = 0;
            } else {
                this.runFrameCount++;
            }
        }
    }

    // All animation logic (moving, etc) 
    Animate () {
        // Jump
        if (keys['Space'] || keys['ArrowUp'] || keys['KeyW']) {
            // console.log('jump');
            this.Jump();
            this.jumping = true;
        } else {
            this.jumpTimer = 0; // helps with if you hold down the jump you jump higher
            this.jumping = false;
        }

        // Slide / Duck
        if (keys['ArrowDown'] || keys['KeyS']) { 
            this.height = this.originalHeight / 2; // make players height divide in half
            this.sliding = true;
        } else {
            this.height = this.originalHeight; // return to original height
            this.sliding = false;
        }

        this.y += this.velocityY; // updates players position to make player increase height

        // Gravity / Fall
        if (this.y + this.height < canvas.height - 2) {
            this.velocityY += gravity; // Slowly will add gravity so it falls
            this.grounded = false;
        } else {
            this.velocityY = 0; // Stop adding gravity (doesn't fall through the floor)
            this.grounded = true;
            this.y = canvas.height - this.height - 2; 
        }

        this.Draw();
    }

    Jump () {
        if (this.grounded && this.jumpTimer == 0) { // If on ground and not falling down
            this.jumpTimer = 1;
            this.velocityY -= this.jumpForce; // Jump
        } else if (this.jumpTimer > 0 && this.jumpTimer < 15) { // If in air BUT not at max height and still holding jump button
            this.jumpTimer++; 
            this.velocityY = -this.jumpForce - (this.jumpTimer / 50); // Add more height to jump
        }
    }

}

class Obstacle {
    constructor (x, y, width, height, color) {
        // Position of the obstacle
        this.x = x;
        this.y = y;

        // Dimensions of the obstacle
        this.width = width;
        this.height = height;

        // Customization of the obstacle
        this.color = color;

        // Obstacles Velocity
        this.velocityX = -(gameSpeed);
    }

    Update () {
        this.x += this.velocityX; // updates obstacles position to make it move left
        this.Draw();
        this.velocityX = -(gameSpeed); // updates speed of obstacle because it will increase as the game goes on
    }

    Draw () {
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.closePath();
    }
}

// Helper Functions
function imageload(imagePath) {
    let img = new Image();
    img.src = imagePath;
    return img;
}

function randomInt (min, max) { // helper function
    return Math.round(Math.random() * (max - min) + min);
}

// Game Functions
function spawnObstacle () {
    let size = randomInt(20, 70);
    // console.log(size);
    let type = randomInt(0, 1); // 0 = ground obstacle | 1 = flying obstacle
    let obstacle = new Obstacle(canvas.width + size, canvas.height - size - 2, size, size, 'rgb(0, 0, 255)');

    if (type == 1) {
        obstacle.y -= player.originalHeight - 12; // Create flying obstacle
    } 
    obstacles.push(obstacle);

}


let initialSpawnTimer = 200;
let spawnTimer = initialSpawnTimer;

function Update () {
    if (gameRunning == false) {
        score = 0;
        gameSpeed = 3;
        obstacles = [];
        scoreText.innerHTML = `Score: ${score}`;
        return;
    }
    requestAnimationFrame(Update); // Runs infinitely

    ctx.clearRect(0, 0, canvas.width, canvas.height); // Start with a fresh canvas after every frame
    ctx.beginPath();
    ctx.fillStyle = 'rgb(0, 255, 0)';
    ctx.fillRect(0, 415, 2000, 10);
    ctx.closePath();
    spawnTimer--; // will decrease by 1 every frame
    if (spawnTimer <= 0) {
        spawnObstacle();
        // console.log(obstacles);
        spawnTimer = initialSpawnTimer - (gameSpeed * 10); // Slowly gets quicker overtime because gameSpeed increases

        if (spawnTimer < 40) { // prevents next obstacle from spawning immediately / sets max speed obstacles will spawn at
            spawnTimer = 40;
        }

    }

    // Spawn the obstacles
    for (let i = 0; i < obstacles.length; i++) {
        let o = obstacles[i];

        if (o.x + o.width < 0) {
            obstacles.splice(i, 1); // Gets rid of obstacles that player passed
        }

        // Check for collisions / death
        if (player.x < o.x + o.width && player.x + player.width > o.x && 
            player.y < o.y + o.height && player.y + player.height > o.y) {

            // delete all obstacles, reset everything to defaults, and save high score
            obstacles = []; 
            spawnTimer = initialSpawnTimer;
            gameSpeed = 3;
            window.localStorage.setItem('highscore', highscore);
            gameButton.innerHTML = 'Start Game';
            gameRunning = false;
            setup();
            state += 1;
            alert('You Died! Your score is: ' + score);
            score = 0;
        }

        o.Update();
    }

    player.Animate();
    // player.x++; <- FIRST MOVEMENT!!!! **Without clearRect, it will leave a trail of boxes behind

    score++;
    scoreText.innerHTML = `Score: ${score}`;
    if (score > highscore) {
        highscore = score;
        highScoreText.innerHTML = `Highest Score: ${highscore}`;
    }

    gameSpeed += 0.003; // Increases speed of game
}

function startGame() {
    canvas.width = window.innerWidth / 1.25;
    canvas.height = 425; 

    // Set game variables to their default values
    gameSpeed = 3;
    gravity = 1;

    score = 0;
    highscore = 0;
    if (localStorage.getItem('highscore')) {
        highscore = localStorage.getItem('highscore');
    }
    highScoreText.innerHTML = `Highest Score: ${highscore}`;

    player = new Player(75, 150, 80, 80, '#FF5858') // Creates your player
    requestAnimationFrame(Update)
}

let gameRunning = false;
const gameButton = document.getElementById('gameButton');
let state = 0;

gameButton.addEventListener('click', function() {
    if (state % 2 == 0) {
        gameButton.innerHTML = 'Reset Game';
        if (!gameRunning) {
            gameRunning = true;
            startGame();
            state += 1;
        }
    } else {
        gameButton.innerHTML = 'Start Game';
        gameRunning = false;
        setup();
        state += 1;
    }  
});

setup();




