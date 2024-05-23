import Game from "./Game.js"
import Timer from "./Timer.js";

let game = new Game();
game.draw();

let ticker = new Timer(_=> {
    game.runActionPeriod();
    game.draw();
}, Game.settings.actionRate);
ticker.start();

window.onkeydown = e => {
    switch (e.key) {
        case "s":
            game.save();
            break;
        case "l":
            game.load();
            break;
    }
}