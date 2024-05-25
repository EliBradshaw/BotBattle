import Bot from "../Bot.js";

export default class Bot2 extends Bot {
    constructor() {
        super();
        this.test = 0;
    }   
    
    actionTime() {
        this.shootPellet(this.test);
        this.test += 0.2;
        if (this.canJump)
            this.jump();

        this.doMove(Math.random() - 0.5);
        this.activateShield();
    }
}
