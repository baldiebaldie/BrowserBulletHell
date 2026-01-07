import { Bullet } from './bullet.js';

export class Cannon {
    constructor (side, index, size) {
        this.side = side;
        this.index = index;
        this.element = document.createElement('div');
        this.size = size;
        if(side == 'right' || side == 'bottom') {
            this.isFlipped = true;
        }
        else {
            this.isFlipped = false;
        }
        
    }

    fire(playableArea, activeBullets, externalBulletSpeed = null) {
        const bulletSpeed = externalBulletSpeed !== null ? externalBulletSpeed : startingBulletSpeed;
        const bulletSize = 30;
        let cannonPosition = this.element.getBoundingClientRect();
        let areaRect = playableArea.getBoundingClientRect();

        // console.log('Cannon:', this.side);
        // console.log('  Absolute cannon pos:', cannonPosition.left, cannonPosition.top);
        // console.log('  Absolute area offset:', areaRect.left, areaRect.top);
        // console.log('  Area dimensions:', areaRect.width, areaRect.height);
        // // Then after calculating spawnPositionX/Y:
        // console.log('  → Spawn at (relative):', spawnPositionX, spawnPositionY);


        // console.log(cannonPosition.top , this.side);

        var xVelocity;
        var yVelocity;
        var bulletColor;
        var spawnPositionX;
        var spawnPositionY;


        //handle inital direction
        switch(this.side) {
            case ('cannonSidebarLeft'):
                xVelocity = 1 * bulletSpeed;
                yVelocity = 0;
                spawnPositionX = 0;
                spawnPositionY = ((cannonPosition.top - areaRect.top) / 0.75) + (cannonPosition.height / 0.75 / 2) - (bulletSize / 2);
                // console.log(spawnPositionX, spawnPositionY, this.side);
                // bulletColor = 'red';
                break;
            case ('cannonSidebarRight'):
                xVelocity = -1 * bulletSpeed;
                yVelocity = 0;
                spawnPositionX = playableArea.offsetWidth - bulletSize;
                spawnPositionY = ((cannonPosition.top - areaRect.top) / 0.75) + (cannonPosition.height / 0.75 / 2) - (bulletSize / 2);
                // console.log(spawnPositionX, spawnPositionY, this.side, cannonPosition.left, areaRect);
                // bulletColor = 'blue';
                break;
            case ('cannonSidebarTop'):
                xVelocity = 0;
                yVelocity = 1 * bulletSpeed;
                spawnPositionX = ((cannonPosition.left - areaRect.left) / 0.75) + (cannonPosition.width / 0.75 / 2) - (bulletSize / 2);
                spawnPositionY = 0;
                // console.log(spawnPositionX, spawnPositionY, this.side);
                // bulletColor = 'green';
                break;
            case ('cannonSidebarBottom'):
                xVelocity = 0;
                yVelocity = -1 * bulletSpeed;
                spawnPositionX = ((cannonPosition.left - areaRect.left) / 0.75) + (cannonPosition.width / 0.75 / 2) - (bulletSize / 2);
                spawnPositionY = playableArea.offsetHeight - bulletSize;
                // console.log(spawnPositionX, spawnPositionY, this.side);
                // bulletColor = 'purple';
                break;
        }
        
        const startingSize = 1;
        let myBullet = new Bullet(bulletSpeed, startingSize, xVelocity, yVelocity, spawnPositionX, spawnPositionY, bulletColor);

        //create the HTML element for it
        myBullet.element.classList.add('bullet');
        myBullet.element.style.position = 'absolute';
        myBullet.element.style.backgroundColor = bulletColor;

        playableArea.appendChild(myBullet.element);
        activeBullets.push(myBullet);
    }

}

