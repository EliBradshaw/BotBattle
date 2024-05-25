import Bot from "../Bot.js";

export default class Example extends Bot {
    constructor() {
        super();
        this.test = 0;
    }   
    
    actionTime(board) {
        this.shootPellet(this.test);
        this.test += 0.2;
        if (this.canJump)
            this.jump();

        this.doMove(Math.random() - 0.5);
        this.activateShield();
    }
}
