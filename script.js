// Define HTML elements
const board = document.getElementById('game-board');
const instructionText = document.getElementById('instruction-text');
const logo = document.getElementById('logo');
const score = document.getElementById('score');
const highScoreText = document.getElementById('highScore');

// Define game variables
const gridSize = 20;
let snake = [{ x: 10, y: 10 }]
let food = generateFood();
let highScore = 0;
let direction = 'right';
let gameInterval;
let gameSpeedDelay = 200;
let gameStarted = false;
let lastDirection = direction;

// Draw game map, snake and food
function draw() {
    board.innerHTML = '';
    drawSnake();
    drawFood();
    updateScore();
}

// Draw snake
function drawSnake() {
    snake.forEach((segment) => {
        const snakeElement = createGameElement('div', 'snake');
        setPosition(snakeElement, segment);
        board.appendChild(snakeElement);
    });
}

// Create the snake or the food cube/div
function createGameElement(tag, className) {
    const element = document.createElement(tag);
    element.className = className;
    return element;
}

// Set the position of the snake or the food
function setPosition(element, position) {
    element.style.gridColumn = position.x;
    element.style.gridRow = position.y;
}

// Draw food
function drawFood() {
    if (gameStarted) {
        const foodElement = createGameElement('div', 'food');
        setPosition(foodElement, food);
        board.appendChild(foodElement);
    }
}

// Generate food
function generateFood() {
    let newFoodPosition;
    let isOnSnake;

    do {
        newFoodPosition = {
            x: Math.floor(Math.random() * gridSize) + 1,
            y: Math.floor(Math.random() * gridSize) + 1
        };

        isOnSnake = snake.some(segment => {
            return segment.x === newFoodPosition.x && segment.y === newFoodPosition.y;
        });

    } while (isOnSnake);

    return newFoodPosition;
}

// Move snake
function move() {
    const head = { ...snake[0] };
    
    switch (direction) {
        case 'right':
            head.x++;
            break;
        case 'down':
            head.y++;
            break;
        case 'left':
            head.x--;
            break;
        case 'up':
            head.y--;
            break;
    }

    snake.unshift(head);

    // If snake eats the food
    if (head.x === food.x && head.y === food.y) {
        food = generateFood();
        increaseSpeed();
        clearInterval(gameInterval);
        gameInterval = setInterval(() => {
            move();
            checkCollision();
            draw();
        }, gameSpeedDelay);
    }
    else {
        snake.pop();
    }

    lastDirection = direction;
}

// Start game
function startGame() {
    gameStarted = true;
    instructionText.style.display = 'none';
    logo.style.display = 'none';
    gameInterval = setInterval(() => {
        move();
        checkCollision();
        draw();
    }, gameSpeedDelay);
}

// Listen to the "Space" key press
function handleKeyPress(event) {
    if ((!gameStarted && event.code === 'Space') || 
        (!gameStarted && event.key === ' ')) {
        startGame();
    }
    else {
        switch (event.key) {
            case 'ArrowRight':
                if (lastDirection !== 'left') direction = 'right';
                break;
            case 'ArrowDown':
                if (lastDirection !== 'up') direction = 'down';
                break;
            case 'ArrowLeft':
                if (lastDirection !== 'right') direction = 'left';
                break;
            case 'ArrowUp':
                if (lastDirection !== 'down') direction = 'up';
                break;
        }
    }
}

document.addEventListener('keydown', handleKeyPress);

// Increase speed of the snake
function increaseSpeed() {
    if (gameSpeedDelay > 150) {
        gameSpeedDelay -= 5;
    }
    else if (gameSpeedDelay > 100) {
        gameSpeedDelay -= 3;
    }
    else if (gameSpeedDelay > 50) {
        gameSpeedDelay -= 2;
    }
    else if (gameSpeedDelay > 25) {
        gameSpeedDelay -= 1;
    }
}

// Check for collision
function checkCollision() {
    const head = snake[0];

    if (head.x < 1 ||
        head.x > gridSize ||
        head.y < 1 ||
        head.y > gridSize) {
            resetGame();
    }

    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            resetGame();
        }
    }
}

// Reset the game
function resetGame() {
    updateHighscore();
    stopGame();
    snake = [{ x: 10, y: 10 }];
    food = generateFood();
    direction = 'right';
    gameSpeedDelay = 200;
    updateScore();
}

// Update the in-game score
function updateScore() {
    const currentScore = snake.length - 1;
    score.textContent = currentScore.toString().padStart(3, '0');
}

// Update the high score
function updateHighscore() {
    const currentScore = snake.length - 1;

    if (currentScore > highScore) {
        highScore = currentScore;
        highScoreText.textContent = highScore.toString().padStart(3, '0');
    }

    highScoreText.style.display = 'block';
}

// Stop the game
function stopGame() {
    clearInterval(gameInterval);
    gameStarted = false;
    instructionText.style.display = 'block';
    logo.style.display = 'block';
}