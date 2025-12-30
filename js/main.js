// main.js
import { keyPressed } from './input.js';
import { spawnCannons, randomPattern, allCannons} from './cannonLogic.js';
import { initializeControlPanel } from './controlPanel.js';


const playableArea = document.querySelector('.playableArea');
const heartsContainer = document.getElementById('heartsContainer');
const gameOverDisplay = document.getElementById('gameOverDisplay');

//variables
var frameCount = 0;
let yStartingPosition = playableArea.clientWidth/2;
let xStartingPosition = playableArea.clientHeight/2;
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
    }
}

class player {

    constructor(x, y, speed, playableArea) {
        this.x = x;
        this.y = y;
        this.speed = speed;
        this.element = document.createElement('div');
        this.playableArea = playableArea;

        //hit detection properties
        this.isHit = false;
        this.isInvincible = false;
        this.hitTimer = 0;
        this.invincibilityDuration = 1000; // 1 second of invincibility
        this.flashDuration = 150; // 150ms red flash

        this.createPlayer();
    }

    createPlayer() {
        this.element.classList.add('player');
        playableArea.appendChild(this.element);
    }

    calculateBounds() {
        this.yConstraint = playableArea.clientWidth - this.element.offsetWidth;
        this.xConstraint = playableArea.clientHeight - this.element.offsetHeight;
        // console.log(this.yConstraint, this.xConstraint);
        if(this.x > this.xConstraint) {
            this.x = this.xConstraint
        }

        //Validation check seeing that if player leaves bounds, it sets the position to that of the bound
        if(this.y > this.yConstraint) {
            this.y = this.yConstraint
        }

        if(this.x < 0) {
            this.x = 0;
        }

        if(this.y < 0) {
            this.y = 0;
        }
    }

    //handle the players inputs
    handleInput(key) {
        if(key['w'] || key['ArrowUp']) {
            this.y -= this.speed;
        }
        if(key['s'] || key['ArrowDown']) {
            this.y += this.speed;
        }
        if(key['a'] || key['ArrowLeft']) {
            this.x -= this.speed;
        }
        if(key['d'] || key['ArrowRight']) {
            this.x += this.speed;
        }
    }
     
     draw () {
        this.element.style.top = `${this.y}px`;
        this.element.style.left = `${this.x}px`;

        //handle hit visual feedback
        if (this.isHit) {
            const timeSinceHit = Date.now() - this.hitTimer;

            if (timeSinceHit < this.flashDuration) {
                // Flash red during flash duration
                this.element.style.backgroundColor = 'red';
            } else if (timeSinceHit < this.invincibilityDuration) {
                // Still invincible but not flashing - return to black
                this.element.style.backgroundColor = 'black';
            } else {
                // Invincibility expired - reset state
                this.isHit = false;
                this.isInvincible = false;
                this.element.style.backgroundColor = 'black';
            }
        }
     }

     onHit() {
        if (!this.isInvincible) {
            this.isHit = true;
            this.isInvincible = true;
            this.hitTimer = Date.now();
            lives -= 1;
            console.log(`Lives remaining: ${lives}`);
            updateLivesDisplay();
        }
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
const myPlayer = new player(xStartingPosition, yStartingPosition, gameConfig.playerSpeed, playableArea);

//initialize lives display
initializeLivesDisplay();

//function which updates each frame
function update() {
    myPlayer.speed = gameConfig.playerSpeed;
    myPlayer.handleInput(keyPressed);
    myPlayer.calculateBounds();
    myPlayer.draw();

    //random cannon shooting pattern
    randomPattern(frameCount, activeBullets, playableArea, myPlayer, gameConfig.fireRate, gameConfig.bulletSpeed);
    frameCount++;

    //starts the loop
    requestAnimationFrame(update);

    // console.log(myPlayer.x , myPlayer.y);
}


update();


