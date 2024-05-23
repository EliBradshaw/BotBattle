import Box from "./Box.js";
import CollisionHandler from "./CollisionHandler.js";
import Game from "./Game.js";
import Vector from "./Vector.js";

export default class Pellet {
    constructor(position, angle, owner) {
        this.position = position;
        this.position.add(
            new Vector(
                Game.botDims.width,
                Game.botDims.height/2,
            )
        )
        this.angle = angle;
        this.velocity = new Vector(
            Math.sin(angle) * Game.settings.pelletSpeed, 
            Math.cos(angle) * Game.settings.pelletSpeed,
        );
        this.owner = owner;
        this.lifetime = 120;
        this.big = false;
    }

    move(game) {
        let bp = new Box(
            this.position.added(new Vector(-5, -5)),
            10,
            10
        );
        for (let bot of game.bots) {
            if (bot == this.owner) continue;
            if (bot.genBox().collides(bp)) {
                if (bot.shieldLast != 0)
                    bot.health -= this.big ? Game.settings.bashDamage : Game.settings.pelletDamage;
                this.lifetime = 0;
            }
        }
        if (!this.big) {
            if (game.colHandler.doesCollide(bp))
                this.lifetime = 0;
            
            this.position.add(this.velocity);
        }
        this.lifetime--;
    }

    bigMove() {
        this.position.add(new Vector(
            Math.sin(this.angle) * Game.botDims.height, 
            Math.cos(this.angle) * Game.botDims.height,
        ));
    }

    genCopy() {
        let pel = new Pellet(
            this.position.copy(),
            this.angle,
            this.owner
        );
        pel.big = this.big;
        pel.lifetime = this.lifetime;
        return pel;
    }
}