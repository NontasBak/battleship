class Ship {
    constructor(length) {
        this.length = length;
        this.timesHit = 0;
        this.hits = [];
        this.isSunk = false;
    }

    hit(x = null, y = null) {
        if (this.isSunk) {
            throw new Error("Ship is already sunk");
        }
        this.timesHit++;
        this.hits.push({ x, y });
        if (this.determineIfSunk()) this.isSunk = true;
    }

    isHit(x, y) {
        return this.hits.some((hit) => hit.x === x && hit.y === y);
    }

    determineIfSunk() {
        if (this.timesHit === this.length) {
            return true;
        }
        return false;
    }
}

export default Ship;
