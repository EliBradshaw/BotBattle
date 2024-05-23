import Vector from "./Vector.js";

export default class Box {
    constructor(position, width, height, platform = false) {
        this.position = position;
        this.width = width;
        this.height = height;
        this.platform = platform;
    }

    collides(other) {
        const xOverlap = this.position.x < other.position.x + other.width && 
            this.position.x + this.width > other.position.x;
        const yOverlap = this.position.y < other.position.y + other.height && 
            this.position.y + this.height > other.position.y;

        return xOverlap && yOverlap;
    }
}