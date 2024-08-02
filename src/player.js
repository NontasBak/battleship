import GameBoard from "./gameBoard";

class Player {
    constructor(type) {
        this.type = type; //Player or Computer
        this.gameBoard = new GameBoard();
    }
}

export default Player;