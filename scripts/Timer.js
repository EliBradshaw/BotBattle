export default class Timer {
    constructor(fun, TAS) {
        this.fun = fun;
        this.TAS = TAS;
        this.perfectDelta = 1000/TAS;
        this.averageCost = 0;
    }

    start() {
        let now = performance.now();
        this.fun();
        let change = performance.now() - now;
        this.averageCost = this.averageCost * 9 + change;
        this.averageCost /= 10;
        setTimeout(_=>this.start(), this.perfectDelta - this.averageCost);
    }
}