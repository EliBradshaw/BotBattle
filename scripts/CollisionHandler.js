export default class CollisionHandler {
    constructor() {
        this.boxes = [];
    }

    addBox(box) {
        this.boxes.push(box);
    }

    doesCollide(other, bot = null) {
        for (let box of this.boxes) {
            if (!box.collides(other))
                continue;
            if (box.platform) {
                if (!bot)
                    return box;
                if (bot.velocity.y < 0)
                    return null;
                if (other.position.y + other.height > box.position.y + box.height)
                    return null;
                return box;
            }
            return box;
        }
        return null;
    }
}