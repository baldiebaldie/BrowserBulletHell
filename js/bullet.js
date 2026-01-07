export class Bullet {
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