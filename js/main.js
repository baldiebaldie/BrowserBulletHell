// main.js
import { keyPressed } from './input.js';
import { spawnCannons, randomPattern, allCannons} from './cannonLogic.js';
import { initializeControlPanel } from './controlPanel.js';
import { player } from './player.js';


const playableArea = document.querySelector('.playableArea');
const heartsContainer = document.getElementById('heartsContainer');
const gameOverDisplay = document.getElementById('gameOverDisplay');

//variables
var frameCount = 0;
var cannonSize = 1;
let activeBullets = [];
let maxLives = 3; //adjust this value to change starting lives
let lives = maxLives;
let gameOver = false;

const gameConfig = {
    playerSpeed: 3,
    bulletSpeed: 1,
    fireRate: 100,
    cannonCount: 15,
    onCannonCountChange: null
};

//initialize hearts display
function initializeLivesDisplay() {
    for (let i = 0; i < maxLives; i++) {
        const heart = document.createElement('img');
        heart.src = 'assets/heart.jpeg';
        heart.classList.add('heart');
        heartsContainer.appendChild(heart);
    }
}

//update lives display
function updateLivesDisplay() {
    const hearts = heartsContainer.querySelectorAll('.heart');
    hearts.forEach((heart, index) => {
        heart.classList.toggle('hidden', index >= lives);
    });

    if (lives <= 0 && !gameOver) {
        gameOver = true;
        gameOverDisplay.style.display = 'flex';
        myPlayer.reset();
        clearScreen();
    }
}



//initialize cannons
spawnCannons(gameConfig.cannonCount, cannonSize, 'cannonSidebarLeft');
spawnCannons(gameConfig.cannonCount, cannonSize, 'cannonSidebarRight');
spawnCannons(gameConfig.cannonCount, cannonSize, 'cannonSidebarTop');
spawnCannons(gameConfig.cannonCount, cannonSize, 'cannonSidebarBottom');

console.log(allCannons);

// Initialize control panel
const controlPanel = initializeControlPanel(gameConfig);

// Setup cannon respawn callback
gameConfig.onCannonCountChange = (newCount) => {
    respawnCannons(newCount, cannonSize);
};

// Cannon respawn function
function respawnCannons(newCount, size) {
    const sidebars = ['cannonSidebarLeft', 'cannonSidebarRight', 'cannonSidebarTop', 'cannonSidebarBottom'];

    // Clear existing cannons
    sidebars.forEach(sidebarId => {
        const sidebar = document.getElementById(sidebarId);
        sidebar.innerHTML = '';
    });
    allCannons.length = 0;

    // Respawn with new count
    sidebars.forEach(sidebarId => {
        spawnCannons(newCount, size, sidebarId);
    });
}

//create the player
const myPlayer = new player(gameConfig.playerSpeed, playableArea, handleLives);

//initialize lives display
initializeLivesDisplay();

//function which updates each frame
function update() {
    myPlayer.speed = gameConfig.playerSpeed;
    myPlayer.handleInput(keyPressed);
    myPlayer.calculateBounds();
    if(!gameOver) {
        myPlayer.draw();
        randomPattern(frameCount, activeBullets, playableArea, myPlayer, gameConfig.fireRate, gameConfig.bulletSpeed);
    }

    //random cannon shooting pattern
    frameCount++;

    //starts the loop
    requestAnimationFrame(update);

    // console.log(myPlayer.x , myPlayer.y);
}



function clearScreen() {

}

function handleLives() {
    lives -= 1;
    console.log(`Lives remaining: ${lives}`);
    updateLivesDisplay();
}

update();


