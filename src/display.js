import Ship from "./ship";
import GameBoard from "./gameBoard";

class Display {
    constructor(player, computer) {
        this.player = player;
        this.computer = computer;

        this.cellClickHandler = this.cellClickHandler.bind(this);

        this.dropHandler = this.dropHandler.bind(this);
        this.dragOverHandler = this.dragOverHandler.bind(this);
        this.dragStartHandler = this.dragStartHandler.bind(this);
        this.dragEndHandler = this.dragEndHandler.bind(this);
        this.dragData = null;
        this.validDragging = false;
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
                    if (document.body.classList.contains("starting-screen")) {
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
        if (document.body.classList.contains("starting-screen")) {
            boardDiv.addEventListener("dragover", this.dragOverHandler);
            boardDiv.addEventListener("drop", this.dropHandler);
        } else {
            boardDiv.removeEventListener("dragover", this.dragOverHandler);
            boardDiv.removeEventListener("drop", this.dropHandler);
        }
    }

    dragStartHandler(e) {
        console.log("dragstart");
        const board = this.player.gameBoard.board;
        const i = Number(e.target.dataset.x);
        const j = Number(e.target.dataset.y);

        e.dataTransfer.setData(
            "text/plain",
            board[i][j].ship.getShipDataJSON()
        );
        this.dragData = board[i][j].ship.getShipDataJSON();

        //Remove ship from old position
        const oldShip = board[i][j].ship;
        console.log(oldShip);
        console.log(
            document.querySelector(
                `.cell[data-x="${oldShip.coordinates.x}"][data-y="${oldShip.coordinates.y + i}"]`
            )
        );
        for (let i = 0; i < oldShip.length; i++) {
            if (oldShip.direction === "horizontal") {
                document
                    .querySelector(
                        `.cell[data-x="${oldShip.coordinates.x}"][data-y="${oldShip.coordinates.y + i}"]`
                    )
                    .classList.remove("ship");
                this.player.gameBoard.board[oldShip.coordinates.x][
                    oldShip.coordinates.y + i
                ].ship = null;
            } else {
                document
                    .querySelector(
                        `.cell[data-x="${oldShip.coordinates.x + i}"][data-y="${oldShip.coordinates.y}"]`
                    )
                    .classList.remove("ship");
                this.player.gameBoard.board[oldShip.coordinates.x + i][
                    oldShip.coordinates.y
                ].ship = null;
            }
        }
    }

    dragOverHandler(e) {
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";
        const cells = document.querySelectorAll(".valid-move, .invalid-move");
        if (cells)
            cells.forEach((cell) =>
                cell.classList.remove("valid-move", "invalid-move")
            );
        console.log("dragover");
        // console.log(e.dataTransfer.getData("text/plain"));
        const data = this.dragData;
        // console.log(data);
        const shipData = JSON.parse(data);
        if (!shipData) return;
        const newShip = new Ship(shipData.length);

        const targetCellX = Number(e.target.dataset.x);
        const targetCellY = Number(e.target.dataset.y);
        // console.log(targetCellX, targetCellY);
        if (isNaN(targetCellX) || isNaN(targetCellY)) return;

        const cellsToMoveTo = [];
        for (let i = 0; i < newShip.length; i++) {
            if (shipData.direction === "horizontal") {
                if (targetCellY + i < 10) {
                    cellsToMoveTo.push(
                        document.querySelector(
                            `.player .cell[data-x="${targetCellX}"][data-y="${targetCellY + i}"]`
                        )
                    );
                }
            } else {
                if (targetCellX + i < 10) {
                    cellsToMoveTo.push(
                        document.querySelector(
                            `.player .cell[data-x="${targetCellX + i}"][data-y="${targetCellY}"]`
                        )
                    );
                }
            }
        }

        if (
            this.player.gameBoard.canPlaceShip(
                targetCellX,
                targetCellY,
                shipData.direction,
                newShip
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
        this.validDragging = true;
        const cells = document.querySelectorAll(".valid-move, .invalid-move");
        if (cells)
            cells.forEach((cell) =>
                cell.classList.remove("valid-move", "invalid-move")
            );

        const data = e.dataTransfer.getData("text/plain");
        // console.log(data);
        let shipData;
        try {
            shipData = JSON.parse(data);
        } catch (err) {
            this.dragData = null;
            return;
        }
        const ship = new Ship(shipData.length);
        // ship.coordinates = { x: i, y: j };
        ship.direction = shipData.direction;
        const targetCellX = Number(e.target.dataset.x);
        const targetCellY = Number(e.target.dataset.y);
        if (isNaN(targetCellX) || isNaN(targetCellY)) return;
        // console.log(targetCellX, targetCellY);
        if (
            this.player.gameBoard.canPlaceShip(
                targetCellX,
                targetCellY,
                ship.direction,
                ship
            )
        ) {
            this.player.gameBoard.placeShip(
                targetCellX,
                targetCellY,
                ship.direction,
                ship
            );

            //Remove ship from old position
            this.player.gameBoard.ships = this.player.gameBoard.ships.filter(
                (sp) => {
                    return (
                        this.player.gameBoard.board[shipData.coordinates.x][
                            shipData.coordinates.y
                        ].ship !== sp
                    );
                }
            );
        } else {
            const oldShip = new Ship(shipData.length);
            this.player.gameBoard.placeShip(
                shipData.coordinates.x,
                shipData.coordinates.y,
                shipData.direction,
                oldShip
            );
        }
        this.displayBoardPlayer();
    }

    dragEndHandler(e) {
        // console.log(this.validDragging);
        if (this.validDragging) return;

        console.log("dragend");
        const data = this.dragData;
        const shipData = JSON.parse(data);
        const oldShip = new Ship(shipData.length);
        this.player.gameBoard.placeShip(
            shipData.coordinates.x,
            shipData.coordinates.y,
            shipData.direction,
            oldShip
        );
        this.dragData = null;
        this.validDragging = false;
        this.displayBoardPlayer();
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
