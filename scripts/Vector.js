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

    sub(vec) {
        this.x -= vec.x;
        this.y -= vec.y;
        return this;
    }

    subbed(vec) {
        return new Vector(
            this.x - vec.x,
            this.y - vec.y
        );
    }

    angle() {
        return Math.atan2(this.x, this.y);
    }

    length() {
        return Math.sqrt(this.x ** 2 + this.y ** 2);
    }

    copy() {
        return new Vector(this.x, this.y);
    }
}