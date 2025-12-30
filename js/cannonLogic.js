export let startingBulletSpeed = 1;
var startingSize = 1;
export var allCannons = [];

class cannon {
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
        let cannonPosition = this.element.getBoundingClientRect();
        let areaRect = playableArea.getBoundingClientRect();


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
                spawnPositionX = cannonPosition.right - areaRect.left;
                spawnPositionY = cannonPosition.top - areaRect.top + (cannonPosition.height / 2);
                // console.log(spawnPositionX, spawnPositionY, this.side);
                bulletColor = 'red';
                break;
            case ('cannonSidebarRight'):
                xVelocity = -1 * bulletSpeed;
                yVelocity = 0;
                spawnPositionX = cannonPosition.left - areaRect.left;
                spawnPositionY = cannonPosition.top - areaRect.top + (cannonPosition.height / 2);
                // console.log(spawnPositionX, spawnPositionY, this.side);
                bulletColor = 'blue';
                break;
            case ('cannonSidebarTop'):
                xVelocity = 0;
                yVelocity = 1 * bulletSpeed;
                spawnPositionX = cannonPosition.left - areaRect.left + (cannonPosition.width / 2);
                spawnPositionY = cannonPosition.bottom - areaRect.top;
                // console.log(spawnPositionX, spawnPositionY, this.side);
                bulletColor = 'green';
                break;
            case ('cannonSidebarBottom'):
                xVelocity = 0;
                yVelocity = -1 * bulletSpeed;
                spawnPositionX = cannonPosition.left - areaRect.left + (cannonPosition.width / 2);
                spawnPositionY = cannonPosition.top - areaRect.top;
                // console.log(spawnPositionX, spawnPositionY, this.side);
                bulletColor = 'purple';
                break;
        }

        let myBullet = new bullet(bulletSpeed, startingSize, xVelocity, yVelocity, spawnPositionX, spawnPositionY, bulletColor);

        //create the HTML element for it
        myBullet.element.classList.add('bullet');
        myBullet.element.style.position = 'absolute';
        myBullet.element.style.backgroundColor = bulletColor;

        playableArea.appendChild(myBullet.element);
        activeBullets.push(myBullet);
    }

}

class bullet {
    constructor (speed, size, xVelocity, yVelocity, startingX, startingY, bulletColor) {
        this.speed = speed;
        this.size = size;
        this.element = document.createElement('div');
        this.xVelocity = xVelocity;
        this.yVelocity = yVelocity;
        this.x = startingX;
        this.y = startingY;
        this.startingX = startingX;
        this.startingY = startingY;
        this.bulletColor = bulletColor;
    }

}

export function spawnCannons(count, size, sidebarId) {
    //calculate sizing based on cannon count
    const baseCannonSize = 75;
    const baseGap = 15;
    const playableAreaSize = 750; 
    const sidebarPadding = 100; //50px on each side

    //calculate available space (accounting for padding)
    const availableSpace = playableAreaSize + sidebarPadding;

    //calculate total space needed with base values
    const totalSpaceNeeded = (count * baseCannonSize) + ((count - 1) * baseGap);

    //scale factor to fit cannons into available space
    const scaleFactor = Math.min(1, availableSpace / totalSpaceNeeded);

    //apply scale factor to both size and gap
    const cannonSize = Math.floor(baseCannonSize * scaleFactor);
    const gap = Math.floor(baseGap * scaleFactor);

    //apply the dynamic gap to the sidebar
    let sidebar = document.getElementById(sidebarId);
    sidebar.style.gap = `${gap}px`;

    for(let i = 0; i<count; i ++) {
        let c = new cannon(sidebarId, i, size);
        switch (sidebarId) {
            case ('cannonSidebarLeft'):
                c.index = i;
                break;
            case ('cannonSidebarRight'):
                c.index = (i+count);
                break;
            case ('cannonSidebarTop'):
                c.index = (i+(2*count));
                break;
            case ('cannonSidebarBottom'):
                c.index = (i+(3*count));
                break;
        }
        sidebar.appendChild(c.element);
        allCannons.push(c);
        if(sidebarId == 'cannonSidebarRight') {
            c.element.classList.add('cannonFlipped');
        }
        else {
            c.element.classList.add('cannon');
        }

        // Apply dynamic size to each cannon
        c.element.style.width = `${cannonSize}px`;
        c.element.style.height = `${cannonSize}px`;

    }
    
    //variables to work with each side
    var leftCannons = allCannons.filter(c => c.side === 'cannonSidebarLeft');
    var rightCannons = allCannons.filter(c => c.side === 'cannonSidebarRight');
    var topCannons = allCannons.filter(c => c.side === 'cannonSidebarTop');
    var bottomCannons = allCannons.filter(c => c.side === 'cannonSidebarBottom');
}

export function randomPattern(frameCount, activeBullets, playableArea, myPlayer, fireRate = 100, bulletSpeed = 1) {
    //bullet logic (every 50 frames)
    if(frameCount % fireRate == 0) {
        let randomCannonIndex = Math.floor(Math.random() * allCannons.length)
        let randomCannon = allCannons[randomCannonIndex];

        randomCannon.fire(playableArea, activeBullets, bulletSpeed);
        // console.log(randomCannon);
    }

    for (let i = activeBullets.length - 1; i>=0; i--) {
        let b = activeBullets[i];

        //get the actual "Hitbox" rectangles from the DOM elements
        let playerRect = myPlayer.element.getBoundingClientRect()
        let bulletRect = b.element.getBoundingClientRect()


        //moveBullet
        b.x += b.xVelocity;
        b.y += b.yVelocity;
        b.element.style.left = `${b.x}px`;
        b.element.style.top = `${b.y}px`;

        //check collision first
        const hit = checkCollision(playerRect, bulletRect);
        const outOfBounds = checkDespawn(b, playableArea)
        if(hit) {
            myPlayer.onHit();
        }

        //despawn logic
        if(hit || outOfBounds) {
            b.element.remove();
            activeBullets.splice(i, 1);
        }
    }
}

function checkDespawn(bullet, playableArea) {
    //if it leaves the right side
    if (bullet.x > playableArea.clientWidth || bullet.x < 0 || bullet.y > playableArea.clientHeight || bullet.y < 0) {
        return true;
    }
    return false;
}

export function checkCollision (obj1, obj2) {
    
    return (
        obj1.left < obj2.right && 
        obj1.right > obj2.left &&
        obj1.top < obj2.bottom &&
        obj1.bottom > obj2.top
    );
}
