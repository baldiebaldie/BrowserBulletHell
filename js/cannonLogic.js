var startingBulletSpeed = 5;
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

    fire(playableArea, activeBullets) {
        let cannonPosition = this.element.getBoundingClientRect();
        let areaRect = playableArea.getBoundingClientRect();

        let spawnPositionX = cannonPosition.left - areaRect.left;
        let spawnPositionY = cannonPosition.top - areaRect.top;


        var xVelocity;
        var yVelocity;


        //handle inital direction
        switch(this.side) {
            case ('cannonSidebarLeft'):
                xVelocity = 1 * startingBulletSpeed;
                yVelocity = 0;
                break;
            case ('cannonSidebarRight'):
                xVelocity = -1 * startingBulletSpeed;
                yVelocity = 0;
                break;
            case ('cannonSidebarTop'):
                xVelocity = 0;
                yVelocity = 1 * startingBulletSpeed;
                break;
            case ('cannonSidebarBottom'):
                xVelocity = 0;
                yVelocity = -1 * startingBulletSpeed;
                break;
        }

        let myBullet = new bullet(startingBulletSpeed, startingSize, xVelocity, yVelocity, spawnPositionX, spawnPositionY);

        //create the HTML element for it
        myBullet.element.classList.add('bullet');
        myBullet.element.style.position = 'absolute';

        //draw bullet
        myBullet.element.style.left = `${spawnPositionX}px`;
        myBullet.element.style.top = `${spawnPositionY}px`;

        playableArea.appendChild(myBullet.element);
        activeBullets.push(myBullet);
    }

}

class bullet {
    constructor (speed, size, xVelocity, yVelocity, startingX, startingY) {
        this.speed = speed;
        this.size = size;
        this.element = document.createElement('div');
        this.xVelocity = xVelocity;
        this.yVelocity = yVelocity;
        this.x = startingX;
        this.y = startingY;
        this.startingX = startingX;
        this.startingY = startingY;
    }

}

export function spawnCannons(count, size, sidebarId) {
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
        let sidebar = document.getElementById(sidebarId);
        sidebar.appendChild(c.element);
        allCannons.push(c);
        if(sidebarId == 'cannonSidebarRight') {
            c.element.classList.add('cannonFlipped');
        }
        else {
            c.element.classList.add('cannon');
        }

    }
    
    //variables to work with each side
    var leftCannons = allCannons.filter(c => c.side === 'cannonSidebarLeft');
    var rightCannons = allCannons.filter(c => c.side === 'cannonSidebarRight');
    var topCannons = allCannons.filter(c => c.side === 'cannonSidebarTop');
    var bottomCannons = allCannons.filter(c => c.side === 'cannonSidebarBottom');
}

export function randomPattern(frameCount, activeBullets, playableArea) {
    //bullet logic (every 20 frames)
    if(frameCount % 20 == 0) {
        let randomCannonIndex = Math.floor(Math.random() * allCannons.length)
        let randomCannon = allCannons[randomCannonIndex];

        randomCannon.fire(playableArea, activeBullets);
    }

    for (let i = activeBullets.length - 1; i>=0; i--) {
        let b = activeBullets[i];

        //moveBullet
        b.x += b.xVelocity;
        b.y += b.yVelocity;
        b.element.style.left = `${b.x}px`;
        b.element.style.top = `${b.y}px`;

        //despawn logic
        if (b.x > playableArea.clientWidth) {
            b.element.remove();
            activeBullets.splice(i, 1);
        }
    }
}

export function checkCollision (obj1, obj2){
    return (
        obj1.left < obj2.right && 
        obj1.right > obj2.left &&
        obj1.top < obj2.bottom &&
        obj1.bottom > obj2.top
    );
}