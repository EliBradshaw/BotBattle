import Box from "./Box.js";
import Game from "./Game.js";
import Vector from "./Vector.js";

export default class Bot {
    constructor() {
        this.position = new Vector(700, 400);
        this.velocity = new Vector();
        this.cooldowns = {
            pellet: 0,
            bash: 0,
            shield: 0,
        };
        this.shieldLast = 0;
        this.pellets = 0;
        this.health = 100;
        this.resetSubFlags(null);
    }
    
    genSaveData() {
        return {
            cooldowns: {
               pellet: this.cooldowns.pellet,
               bash: this.cooldowns.bash,
               shield: this.cooldowns.shield
            },
            position: this.position.copy(),
            velocity: this.velocity.copy(),
            pellets: this.pellets,
            shieldLast: this.shieldLast,
            health: this.health
        }
    }

    loadSaveData(saveData) {
        this.cooldowns = saveData.cooldowns;
        this.position = saveData.position;
        this.velocity = saveData.velocity;
        this.pellets = saveData.pellets;
        this.shieldLast = saveData.shieldLast;
        this.health = saveData.health;
    }

    reduceCooldowns() {
        this.cooldowns.pellet--;
        this.cooldowns.bash--;
        if (this.shieldLast <= 0)
            this.cooldowns.shield--;
        else
            this.shieldLast--;
    }

    canBash() {
        return this.cooldowns.bash <= 0;
    }

    genBox() {
        return new Box(
            this.position,
            Game.botDims.width,
            Game.botDims.height,
        )
    }

    canShield() {
        if (this.shieldLast > 0)
            return false;
        return this.cooldowns.shield <= 0;
    }

    resetSubFlags(game) {
        this.angle = 0;
        this.move = 0;
        this.didJump = false;
        this.attack = "none";
        this.game = game;
    }

    doMove(direction) {
        if (direction > 0)
            this.move = 1;
        if (direction < 0)
            this.move = -1;
    }

    jump() {
        this.didJump = true;
        this.canJump = false;
    }

    shootPellet(angle) {
        if (this.pellets <= 0 || this.attack != "none")
            return;
        this.attack = "pellet";
        this.angle = angle;
        this.cooldowns.pellet = Game.settings.pelletCooldown;
        this.pellets--;
    }

    bash(angle) {
        if (!this.canBash() || this.attack != "none")
            return;
        this.attack = "bash";
        this.angle = angle;
        this.cooldowns.bash = Game.settings.bashCooldown;
    }

    activateShield() {
        if (!this.canShield())
            return;
        this.shieldLast = Game.settings.shieldLast+1;
        this.cooldowns.shield = Game.settings.shieldCooldown;
        this.shield = true;
    }

    actionTime() {
        
    }
}
