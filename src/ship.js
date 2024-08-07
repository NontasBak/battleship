class Ship {
    constructor(length) {
        this.length = length;
        this.timesHit = 0;
        this.hits = [];
        this.isSunk = false;
        this.coordinates = null;
        this.direction = null;
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

    getShipDataJSON() {
        return JSON.stringify({
            coordinates: this.coordinates,
            direction: this.direction,
            length: this.length,
            allCellCoordinates: this.getAllCellCoordinates(),
        });
    }

    getAllCellCoordinates() {
        const coordinates = [];
        switch (this.direction) {
            case "horizontal":
                for (let i = 0; i < this.length; i++) {
                    coordinates.push([this.coordinates.x, this.coordinates.y + i]);
                }
                break;
            case "vertical":
                for (let i = 0; i < this.length; i++) {
                    coordinates.push([this.coordinates.x + i, this.coordinates.y]);
                }
                break;
        }
        return coordinates;
    }
}

export default Ship;
