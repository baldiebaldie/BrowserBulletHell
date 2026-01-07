export class ControlPanel {
    constructor(gameConfig) {
        this.gameConfig = gameConfig;
        this.sliders = {
            playerSpeed: document.getElementById('playerSpeedSlider'),
            bulletSpeed: document.getElementById('bulletSpeedSlider'),
            fireRate: document.getElementById('fireRateSlider'),
            cannonCount: document.getElementById('cannonCountSlider'),
            spawnsPerTick: document.getElementById('spawnsPerTickSlider')
        };
        this.valueDisplays = {
            playerSpeed: document.getElementById('playerSpeedValue'),
            bulletSpeed: document.getElementById('bulletSpeedValue'),
            fireRate: document.getElementById('fireRateValue'),
            cannonCount: document.getElementById('cannonCountValue'),
            spawnsPerTick: document.getElementById('spawnsPerTickValue')
        };

        this.initializeEventListeners();
    }

    initializeEventListeners() {
        //player Speed
        this.sliders.playerSpeed.addEventListener('input', (e) => {
            const value = parseFloat(e.target.value);
            this.gameConfig.playerSpeed = value;
            this.valueDisplays.playerSpeed.textContent = value.toFixed(1);
        });

        //bullet Speed
        this.sliders.bulletSpeed.addEventListener('input', (e) => {
            const value = parseFloat(e.target.value);
            this.gameConfig.bulletSpeed = value;
            this.valueDisplays.bulletSpeed.textContent = value.toFixed(1);
        });

        //fire Rate
        this.sliders.fireRate.addEventListener('input', (e) => {
            const value = parseInt(e.target.value);
            this.gameConfig.fireRate = value;
            this.valueDisplays.fireRate.textContent = value;
        });

        //cannon Count
        this.sliders.cannonCount.addEventListener('input', (e) => {
            const value = parseInt(e.target.value);
            this.gameConfig.cannonCount = value;
            this.valueDisplays.cannonCount.textContent = value;

            //trigger cannon respawn callback
            if (this.gameConfig.onCannonCountChange) {
                this.gameConfig.onCannonCountChange(value);
            }
        });

        //spawns Per Tick
        this.sliders.spawnsPerTick.addEventListener('input', (e) => {
            const value = parseInt(e.target.value);
            this.gameConfig.spawnsPerTick = value;
            this.valueDisplays.spawnsPerTick.textContent = value;
        });
    }
}

export function initializeControlPanel(gameConfig) {
    return new ControlPanel(gameConfig);
}
