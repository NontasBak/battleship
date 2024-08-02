import Ship from "./ship";

class Display {
    displayBoard(gameBoard, playerName) {
        const board = gameBoard.board;
        const boardDiv = document.querySelector(`.board.${playerName}`);
        boardDiv.innerHTML = "";
        for (let i = 0; i < board.length; i++) {
            for (let j = 0; j < board[i].length; j++) {
                const cell = document.createElement("div");
                cell.classList.add("cell");
                cell.addEventListener("click", () => {
                    gameBoard.receiveAttack(i, j);
                    this.displayBoard(gameBoard, playerName);
                });
                if (board[i][j].hit) {
                    cell.classList.add("hit");
                }
                if (board[i][j].ship) {
                    cell.classList.add("ship");
                } else {
                    cell.classList.add("water");
                }
                boardDiv.appendChild(cell);
            }
        }
    }

    placeShipsDeterministic(board) {
        //Fixed values for now
        const ship1 = new Ship(1);
        const ship2 = new Ship(2);
        const ship3 = new Ship(3);
        const ship4 = new Ship(4);

        board.placeShip(0, 0, ship1, "horizontal");
        board.placeShip(1, 2, ship2, "vertical");
        board.placeShip(2, 4, ship3, "horizontal");
        board.placeShip(4, 6, ship4, "vertical");
    }
}

export default Display;
