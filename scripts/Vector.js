export default class Vector {
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }

    add(vec) {
        this.x += vec.x;
        this.y += vec.y;
        return this;
    }

    added(vec) {
        return new Vector(
            this.x + vec.x,
            this.y + vec.y
        );
    }

    copy() {
        return new Vector(this.x, this.y);
    }
}