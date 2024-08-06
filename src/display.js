import Ship from "./ship";
import GameBoard from "./gameBoard";

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
                    if (board[i][j].ship.isSunk) {
                        cell.classList.add("sunk");
                    }
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
                        if (board[i][j].ship.isSunk) {
                            cell.classList.add("sunk");
                        }
                    } else {
                        cell.classList.add("water");
                    }
                }
                boardDiv.appendChild(cell);
            }
        }
    }

    displayBoardComputerEmpty() {
        const board = this.computer.gameBoard.board;
        const boardDiv = document.querySelector(`.board.computer`);
        boardDiv.innerHTML = "";
        for (let i = 0; i < board.length; i++) {
            for (let j = 0; j < board[i].length; j++) {
                const cell = document.createElement("div");
                cell.classList.add("cell");
                cell.classList.add("unclickable");
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
        if (this.computer.gameBoard.allShipsSunk()) {
            this.finalizeGame("Player");
            return;
        }

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
            // if (!this.player.gameBoard.canReceiveAttack(...randomAttacks)) {
            //     continue;
            // }
            // console.log(randomAttacks);
            // console.log(playerBoard[randomAttacks[0]][randomAttacks[1]].ship);
            // console.log(playerBoard[randomAttacks[0]][randomAttacks[1]].hit);
            this.player.gameBoard.receiveAttack(...randomAttacks);
            this.displayBoardPlayer();
            if (this.player.gameBoard.allShipsSunk()) {
                this.finalizeGame("Computer");
                break;
            }
        } while (
            playerBoard[randomAttacks[0]][randomAttacks[1]].ship ||
            isAlreadyhit
        );
    }

    finalizeGame(winner) {
        const cells = document.querySelectorAll(".cell");
        cells.forEach((cell) => {
            cell.removeEventListener("click", this.cellClickHandler);
        });

        const restartGameContainer = document.createElement("div");
        restartGameContainer.classList.add("restart-game-container");
        const winningMessage = document.createElement("h2");
        winningMessage.textContent = `${winner} won!`;
        const playAgainButton = document.createElement("button");
        playAgainButton.textContent = "Play Again";
        playAgainButton.addEventListener("click", () => {
            // window.location.reload();
            this.player.gameBoard = new GameBoard();
            this.computer.gameBoard = new GameBoard();
            this.player.gameBoard.placeShipRandomly();
            this.computer.gameBoard.placeShipRandomly();
            this.displayBoardPlayer();
            this.startingScreen();
            restartGameContainer.remove();
        });

        restartGameContainer.append(winningMessage, playAgainButton);
        document.body.appendChild(restartGameContainer);
    }

    startingScreen() {
        this.player.gameBoard.placeShipRandomly();
        this.computer.gameBoard.placeShipRandomly();
        this.displayBoardPlayer();
        this.displayBoardComputerEmpty();

        const startGameContainer = document.createElement("div");
        startGameContainer.classList.add("start-game-container");

        const randomizeShipsButton = document.createElement("button");
        randomizeShipsButton.classList.add("randomize-ships");
        randomizeShipsButton.textContent = "Randomize Ships";
        randomizeShipsButton.addEventListener("click", () => {
            this.player.gameBoard.placeShipRandomly();
            this.displayBoardPlayer();
        });

        const startGameButton = document.createElement("button");
        startGameButton.classList.add("start");
        startGameButton.textContent = "Start";
        startGameButton.addEventListener("click", () => {
            this.displayBoardComputer();
            // startGameContainer.style.display = "none";
            startGameContainer.remove();
        });

        const computerContainer = document.querySelector(".computer-container");
        startGameContainer.append(randomizeShipsButton, startGameButton);
        computerContainer.appendChild(startGameContainer);
    }
}

export default Display;
