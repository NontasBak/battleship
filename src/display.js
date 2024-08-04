import Ship from "./ship";

class Display {
    constructor(player, computer) {
        this.player = player;
        this.computer = computer;

        this.cellClickHandler = this.cellClickHandler.bind(this);
    }
    displayBoardPlayer() {
        const board = this.player.gameBoard.board;
        // const board = gameBoard.board
        const boardDiv = document.querySelector(`.board.player`);
        boardDiv.innerHTML = "";
        for (let i = 0; i < board.length; i++) {
            for (let j = 0; j < board[i].length; j++) {
                const cell = document.createElement("div");
                cell.classList.add("cell");
                cell.dataset.x = i;
                cell.dataset.y = j;
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

    displayBoardComputer() {
        const board = this.computer.gameBoard.board;
        // const board = gameBoard.board;
        const boardDiv = document.querySelector(`.board.computer`);
        boardDiv.innerHTML = "";
        for (let i = 0; i < board.length; i++) {
            for (let j = 0; j < board[i].length; j++) {
                const cell = document.createElement("div");
                cell.classList.add("cell");
                cell.dataset.x = i;
                cell.dataset.y = j;
                cell.addEventListener("click", this.cellClickHandler);
                if (board[i][j].hit) {
                    cell.classList.add("hit");
                    if (board[i][j].ship) {
                        cell.classList.add("ship");
                    } else {
                        cell.classList.add("water");
                    }
                }
                boardDiv.appendChild(cell);
            }
        }
    }

    cellClickHandler(e) {
        const x = e.target.dataset.x;
        const y = e.target.dataset.y;

        const computerBoard = this.computer.gameBoard.board;
        if (computerBoard[x][y].hit) return;

        this.computer.gameBoard.receiveAttack(x, y);
        this.displayBoardComputer();

        //If you hit a ship you get to play again
        if (computerBoard[x][y].ship) {
            return;
        }
        const getRandomAttack = () => {
            let randomAttackX = Math.floor(Math.random() * 10);
            let randomAttackY = Math.floor(Math.random() * 10);

            return [randomAttackX, randomAttackY];
        };
        const playerBoard = this.player.gameBoard.board;
        let randomAttacks;
        let isAlreadyhit;
        do {
            randomAttacks = getRandomAttack();

            isAlreadyhit = false;
            if (playerBoard[randomAttacks[0]][randomAttacks[1]].hit) {
                isAlreadyhit = true;
                continue;
            }
            // console.log(randomAttacks);
            // console.log(playerBoard[randomAttacks[0]][randomAttacks[1]].ship);
            // console.log(playerBoard[randomAttacks[0]][randomAttacks[1]].hit);
            this.player.gameBoard.receiveAttack(
                randomAttacks[0],
                randomAttacks[1]
            );
            this.displayBoardPlayer();
        } while (
            playerBoard[randomAttacks[0]][randomAttacks[1]].ship ||
            isAlreadyhit
        );
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
