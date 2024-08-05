import Ship from "./ship";

class GameBoard {
    constructor() {
        this.board = this.createBoard(10);
        this.ships = [];
        this.missedAttacks = [];
    }

    createBoard(length) {
        const board = [];
        for (let i = 0; i < length; i++) {
            board[i] = [];
            for (let j = 0; j < length; j++)
                board[i][j] = { hit: false, ship: null };
        }
        return board;
    }

    placeShip(x, y, direction, ship) {
        if (!this.canPlaceShip(x, y, direction, ship)) {
            throw new Error("Ship cannot be placed.");
        }

        this.ships.push(ship);
        switch (direction) {
            case "horizontal":
                for (let i = 0; i < ship.length; i++) {
                    this.board[x][y + i].ship = ship;
                }
                break;
            case "vertical":
                for (let i = 0; i < ship.length; i++) {
                    this.board[x + i][y].ship = ship;
                }
                break;
        }
    }

    canReceiveAttack(x, y) {
        return !this.board[x][y].hit;
    }

    receiveAttack(x, y) {
        if (!this.canReceiveAttack(x, y))
            throw new Error("Spot is already hit");
        this.board[x][y].hit = true;
        if (this.board[x][y].ship) {
            this.board[x][y].ship.hit(x, y);
        } else {
            this.missedAttacks.push({ x, y });
        }
    }

    allShipsSunk() {
        return this.ships.every((ship) => ship.isSunk);
    }

    canPlaceShip(x, y, direction, ship) {
        //Check if ship is out of bounds or on top of another ship
        if (direction === "horizontal") {
            if (this.board.length < y + ship.length) return false;
            for (let i = 0; i < ship.length; i++)
                if (this.board[x][y + i].ship) return false;
        } else if (direction === "vertical") {
            if (this.board.length < x + ship.length) return false;
            for (let i = 0; i < ship.length; i++)
                if (this.board[x + i][y].ship) return false;
        }

        //Check if ship is right next to another ship
        if (direction === "horizontal") {
            if (
                (this.board[x][y - 1] && this.board[x][y - 1].ship) ||
                (this.board[x][y + ship.length] &&
                    this.board[x][y + ship.length].ship)
            )
                return false;
            for (let i = -1; i < ship.length + 1; i++) {
                if (
                    this.board[x - 1] &&
                    this.board[x - 1][y + i] &&
                    this.board[x - 1][y + i].ship
                )
                    return false;
                if (
                    this.board[x + 1] &&
                    this.board[x + 1][y + i] &&
                    this.board[x + 1][y + i].ship
                )
                    return false;
            }
        } else if (direction === "vertical") {
            if (
                (this.board[x - 1] &&
                    this.board[x - 1][y] &&
                    this.board[x - 1][y].ship) ||
                (this.board[x + ship.length] &&
                    this.board[x + ship.length][y] &&
                    this.board[x + ship.length][y].ship)
            )
                return false;
            for (let i = -1; i < ship.length + 1; i++) {
                if (
                    this.board[x + i] &&
                    this.board[x + i][y - 1] &&
                    this.board[x + i][y - 1].ship
                )
                    return false;
                if (
                    this.board[x + i] &&
                    this.board[x + i][y + 1] &&
                    this.board[x + i][y + 1].ship
                )
                    return false;
            }
        }
        return true;
    }

    placeShipRandomly() {
        const getRandomPosition = () => {
            const randomX = Math.floor(Math.random() * 10);
            const randomY = Math.floor(Math.random() * 10);
            const randomDirection =
                Math.random() < 0.5 ? "horizontal" : "vertical";
            return [randomX, randomY, randomDirection];
        };
        const ship1 = new Ship(1);
        const ship2 = new Ship(1);
        const ship3 = new Ship(1);
        const ship4 = new Ship(1);
        const ship5 = new Ship(2);
        const ship6 = new Ship(2);
        const ship7 = new Ship(2);
        const ship8 = new Ship(3);
        const ship9 = new Ship(3);
        const ship10 = new Ship(4);
        this.ships.push(
            ship1,
            ship2,
            ship3,
            ship4,
            ship5,
            ship6,
            ship7,
            ship8,
            ship9,
            ship10
        );

        this.ships.forEach((ship) => {
            let randomPosition;
            do {
                randomPosition = getRandomPosition();
            } while (!this.canPlaceShip(...randomPosition, ship));
            this.placeShip(...randomPosition, ship);
        });
    }
}

export default GameBoard;
