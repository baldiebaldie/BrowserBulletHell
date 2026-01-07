const playableArea = document.querySelector('.playableArea');



export class player {

    constructor(speed, playableArea, onHit) {
        
        this.speed = speed;
        this.element = document.createElement('div');
        this.playableArea = playableArea;

        //this is a callback method
        this.onHit = onHit;

        //hit detection properties
        this.isHit = false;
        this.isInvincible = false;
        this.hitTimer = 0;
        this.invincibilityDuration = 240; // 1 second of invincibility
        this.flashDuration = 150; // 150ms red flash


        this.reset();
        this.create();
    }

    create() {
        this.element.classList.add('player');
        playableArea.appendChild(this.element);
    }

    reset() {
        this.x = this.playableArea.clientWidth/2;
        this.y = this.playableArea.clientWidth/2;
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
                this.element.style.backgroundColor = 'dark grey';
            } else {
                // Invincibility expired - reset state
                this.isHit = false;
                this.isInvincible = false;
                this.element.style.backgroundColor = 'black';
            }
        }
    }

    hasCollided (bullet) {
        const playerHitbox = this.element.getBoundingClientRect();
        const hit = playerHitbox.left < bullet.right && 
            playerHitbox.right > bullet.left &&
            playerHitbox.top < bullet.bottom &&
            playerHitbox.bottom > bullet.top &&
            !this.isInvincible;

        if(hit) {
            this.onHit();
            this.isHit = true;
            this.isInvincible = true;
            this.hitTimer = Date.now();
        }


        return hit;
    }
}