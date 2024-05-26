import Bot from "./Bot.js";
import Example from "./Bot1/Example.js";
import Bot2 from "./Bot2/Bot2.js";
import Box from "./Box.js";
import CollisionHandler from "./CollisionHandler.js";
import Pellet from "./Pellet.js";
import Vector from "./Vector.js";

export default class Game {
    static settings = {
        actionRate: 15,

        pelletSpeed: 20,
        pelletCooldown: 6,
        pelletDamage: 10,

        bashLifetime: 5,
        bashCooldown: 1,
        bashDamage: 30,

        shieldCooldown: 12,
        shieldLast: 2,

        moveSpeed: 5,
        jumpPower: 15,

    };
    static botDims = {
        width: 30,
        height: 60,
    }
    constructor() {
        /** @type {Bot[]} */
        this.bots = [
            new Example(),
            new Bot2(),
        ];
        this.bots[0].position = new Vector(300, 400); 
        this.bots[1].position = new Vector(1200, 400); 
        this.pellets = [];
        this.colHandler = new CollisionHandler();
        this.colHandler.addBox(
            new Box(
                new Vector(100, 500),
                600,
                50
            )
        );
        this.colHandler.addBox(
            new Box(
                new Vector(900, 500),
                600,
                50
            )
        );
        this.colHandler.addBox(
            new Box(
                new Vector(650, 300),
                300,
                20,
                true,
            )
        );
        this.colHandler.addBox(
            new Box(
                new Vector(100, 250),
                300,
                20,
                true,
            )
        );
        this.colHandler.addBox(
            new Box(
                new Vector(1200, 250),
                300,
                20,
                true,
            )
        );
        this.saves = [];
    }

    addBot(bot) {
        this.bots.push(bot);
    }

    shootPellet(owner) {
        let spawn = owner.position.copy();
        this.pellets.push(new Pellet(spawn, owner.angle, owner));
    }

    bash(owner) {
        let spawn = owner.position.copy();
        let pel = new Pellet(spawn, owner.angle, owner);
        pel.big = true;
        pel.lifetime = Game.settings.bashLifetime;
        pel.bigMove();
        this.pellets.push(pel);
    }

    jump(owner) {
        if (owner.canJump)
            owner.velocity.y -= Game.settings.jumpPower;
    }

    updatePellets() {
        let newPellets = [];
        for (let pellet of this.pellets) {
            if (pellet.lifetime > 0) {
                newPellets.push(pellet);
                pellet.move(this);
            }
        }
        this.pellets = newPellets;
    }

    processActions(bot, postAction = false) {
        bot.velocity.y += 0.5;
        if (bot.cooldowns.pellet <= 0) {
            bot.pellets++;
            bot.cooldowns.pellet = 0;
        }
        if (!postAction) {
            bot.resetSubFlags(this);
            bot.reduceCooldowns();
            bot.actionTime(this);
        }
        switch (bot.attack) {
            case "pellet":
                this.shootPellet(bot);
            break;
            case "bash":
                this.bash(bot);
            break;
        }

        bot.velocity.x = 0;
        let btox = new Box(
            bot.position.added(bot.velocity),
            Game.botDims.width,
            Game.botDims.height
        );
        let cb = this.colHandler.doesCollide(btox, bot);
        if (cb) {
            bot.canJump = false;
            if (bot.velocity.y > 0) {
                bot.canJump = true;
                bot.position.y = cb.position.y - Game.botDims.height;
            }
            bot.velocity.y = 0;
        }
        if (bot.didJump)
            this.jump(bot);
        bot.velocity.x = bot.move * Game.settings.moveSpeed;
        btox.position = bot.position.added(bot.velocity);
        if (this.colHandler.doesCollide(btox))
            bot.velocity.x = 0;
        bot.position.add(bot.velocity);
    }

    save() {
        // We assume that the stage does not change so the collision handlers
        // boxes remain as is.
        let data = {
            bots: this.bots.map(a => a.genSaveData()),
            pellets: this.pellets.map(a => a.genCopy()),
        }
        this.saves.push(data);
    }

    load() {
        let last = this.saves.pop();
        this.bots.forEach((a, i) => a.loadSaveData(last.bots[i]));
        this.pellets = last.pellets;
    }

    runActionPeriod() {
        for (let bot of this.bots) {
            if (bot.health <= 0)
                return;
        }
        this.updatePellets();
        for (let bot of this.bots) {
            this.processActions(bot);
        }
    }

    draw() {
        let board = document.getElementById("board");
        board.innerHTML = "";
        for (let box of this.colHandler.boxes) {
            let boh = document.createElement("div");
            boh.classList.add("box");
            boh.style.left = `${box.position.x-5}px`;
            boh.style.top = `${box.position.y-5}px`;
            boh.style.width = `${box.width}px`;
            boh.style.height = `${box.height}px`;
            board.appendChild(boh);
        }
        for (let bot of this.bots) {
            let boht = document.createElement("div");
            boht.classList.add("bot");
            boht.style.left = `${bot.position.x}px`;
            boht.style.top = `${bot.position.y}px`;
            boht.style.width = `${Game.botDims.width}px`;
            boht.style.height = `${Game.botDims.height}px`;
            if (bot.shieldLast > 0)
                boht.classList.add('shield');

            let bar = document.createElement("div");
            bar.classList.add("bar");

            let ibar = document.createElement("div");
            ibar.style.width = `${bot.health}%`;
            ibar.innerText = `${bot.health}`;
            ibar.classList.add("ibar");

            bar.appendChild(ibar);
            boht.appendChild(bar);
            board.appendChild(boht);
        }
        for (let pellet of this.pellets) {
            let pel = document.createElement("div");
            pel.classList.add(pellet.big ? "big" : "small");
            pel.style.left = `${pellet.position.x-25}px`;
            pel.style.top = `${pellet.position.y-25}px`;
            board.appendChild(pel);
        }
    }

    gameLoop() {

    }
}