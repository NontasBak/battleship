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

    placeShip(x, y, length, direction) {
        shipCanBePlaced = (x, y, length, direction) => {
            if (direction === "horizontal") {
                if (this.board.length < y + length) return false;
                for (let i = 0; i < length; i++)
                    if (this.board[x][y + i].ship) return false;
            } else if (direction === "vertical") {
                if (this.board.length < x + length) return false;
                for (let i = 0; i < length; i++)
                    if (this.board[x + i][y].ship) return false;
            }
            return true;
        };
        if (!shipCanBePlaced(x, y, length, direction)) {
            throw new Error("Ship cannot be placed.");
        }
        
        const ship = new Ship(length);
        this.ships.push(ship);
        switch (direction) {
            case "horizontal":
                for (let i = 0; i < length; i++) {
                    this.board[x][y + i].ship = ship;
                }
                break;
            case "vertical":
                for (let i = 0; i < length; i++) {
                    this.board[x + i][y].ship = ship;
                }
                break;
        }
    }

    receiveAttack(x, y) {
        if (this.board[x][y].hit) throw new Error("Spot is already hit");
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
}

export default GameBoard;
