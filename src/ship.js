class Ship {
    constructor(length) {
        this.length = length;
        this.timesHit = 0;
    }

    hit() {
        if (this.isSunk()) {
            throw new Error("Ship is already sunk");
        }
        this.timesHit++;
    }

    isSunk() {
        if (this.timesHit === this.length) {
            return true;
        }
        return false;
    }
}

export default Ship;
