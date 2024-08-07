import Ship from "./ship";
import GameBoard from "./gameBoard";

class Display {
    constructor(player, computer) {
        this.player = player;
        this.computer = computer;
        this.draggedShip = null;

        this.cellClickHandler = this.cellClickHandler.bind(this);
        this.dropHandler = this.dropHandler.bind(this);
        this.dragOverHandler = this.dragOverHandler.bind(this);
        this.dragStartHandler = this.dragStartHandler.bind(this);
        this.dragEndHandler = this.dragEndHandler.bind(this);
        this.dragEnterHandler = this.dragEnterHandler.bind(this);
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
                cell.addEventListener("dragenter", this.dragEnterHandler);
                cell.addEventListener("dragover", this.dragOverHandler);
                cell.addEventListener("drop", this.dropHandler);
                if (board[i][j].hit) {
                    cell.classList.add("hit");
                }
                if (board[i][j].ship) {
                    cell.classList.add("ship");
                    if (board[i][j].ship.isSunk) {
                        cell.classList.add("sunk");
                    }
                    if (document.body.classList.contains("starting-screen")) {
                        cell.classList.add("movable");
                        cell.draggable = true;
                        cell.addEventListener(
                            "dragstart",
                            this.dragStartHandler
                        );
                        cell.addEventListener("dragend", this.dragEndHandler);
                    }
                } else {
                    cell.classList.add("water");
                }

                boardDiv.appendChild(cell);
            }
        }
    }

    dragStartHandler(e) {
        e.target.classList.add("dragging");
        const board = this.player.gameBoard.board;
        const x = Number(e.target.dataset.x);
        const y = Number(e.target.dataset.y);
        this.draggedShip = board[x][y].ship;

        //Remove ship from old position
        const oldShip = this.draggedShip;
        for (let i = 0; i < oldShip.length; i++) {
            if (oldShip.direction === "horizontal") {
                document
                    .querySelector(
                        `.cell[data-x="${oldShip.coordinates.x}"][data-y="${oldShip.coordinates.y + i}"]`
                    )
                    .classList.remove("ship", "movable");
                this.player.gameBoard.board[oldShip.coordinates.x][
                    oldShip.coordinates.y + i
                ].ship = null;
            } else {
                document
                    .querySelector(
                        `.cell[data-x="${oldShip.coordinates.x + i}"][data-y="${oldShip.coordinates.y}"]`
                    )
                    .classList.remove("ship", "movable");
                this.player.gameBoard.board[oldShip.coordinates.x + i][
                    oldShip.coordinates.y
                ].ship = null;
            }
        }
    }

    dragOverHandler(e) {
        e.preventDefault();
    }

    dragEnterHandler(e) {
        const cells = document.querySelectorAll(".valid-move, .invalid-move");
        if (cells)
            cells.forEach((cell) =>
                cell.classList.remove("valid-move", "invalid-move")
            );

        const x = Number(e.target.dataset.x);
        const y = Number(e.target.dataset.y);

        const cellsToMoveTo = [];
        if (!this.draggedShip) return;
        for (let i = 0; i < this.draggedShip.length; i++) {
            if (this.draggedShip.direction === "horizontal") {
                if (y + i < 10) {
                    cellsToMoveTo.push(
                        document.querySelector(
                            `.player .cell[data-x="${x}"][data-y="${y + i}"]`
                        )
                    );
                }
            } else {
                if (x + i < 10) {
                    cellsToMoveTo.push(
                        document.querySelector(
                            `.player .cell[data-x="${x + i}"][data-y="${y}"]`
                        )
                    );
                }
            }
        }

        if (
            this.player.gameBoard.canPlaceShip(
                x,
                y,
                this.draggedShip.direction,
                this.draggedShip
            )
        ) {
            cellsToMoveTo.forEach((cell) => {
                cell.classList.add("valid-move");
            });
        } else {
            cellsToMoveTo.forEach((cell) => {
                cell.classList.add("invalid-move");
            });
        }
    }

    dropHandler(e) {
        e.preventDefault();
        if (document.querySelector(".dragging"))
            document.querySelector(".dragging").classList.remove("dragging");

        const cells = document.querySelectorAll(".valid-move, .invalid-move");
        if (cells)
            cells.forEach((cell) =>
                cell.classList.remove("valid-move", "invalid-move")
            );

        if (!this.draggedShip) return;
        const ship = new Ship(this.draggedShip.length);
        ship.direction = this.draggedShip.direction;
        const x = Number(e.target.dataset.x);
        const y = Number(e.target.dataset.y);

        if (this.player.gameBoard.canPlaceShip(x, y, ship.direction, ship)) {
            this.player.gameBoard.placeShip(x, y, ship.direction, ship);

            //Remove ship from old position
            this.player.gameBoard.ships = this.player.gameBoard.ships.filter(
                (sp) => {
                    return this.draggedShip !== sp;
                }
            );
        } else {
            this.player.gameBoard.placeShip(
                this.draggedShip.coordinates.x,
                this.draggedShip.coordinates.y,
                this.draggedShip.direction,
                this.draggedShip
            );
        }
        this.draggedShip = null;
        this.displayBoardPlayer();
    }

    dragEndHandler(e) {
        if (e.target.classList.contains("dragging")) {
            e.target.classList.remove("dragging");

            const x = Number(e.target.dataset.x);
            const y = Number(e.target.dataset.y);

            this.player.gameBoard.ships = this.player.gameBoard.ships.filter(
                (sp) => {
                    return this.draggedShip !== sp;
                }
            );

            const oldShip = new Ship(this.draggedShip.length);
            this.player.gameBoard.placeShip(
                x,
                y,
                this.draggedShip.direction,
                oldShip
            );
            this.draggedShip = null;
            this.displayBoardPlayer();
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

    async cellClickHandler(e) {
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

        const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
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
            await wait(300);
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
        document.body.classList.add("starting-screen");
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
            document.body.classList.remove("starting-screen");
            this.displayBoardPlayer();
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
