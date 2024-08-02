import GameBoard from "../src/gameBoard";
import Ship from "../src/ship";

test("Gameboard should place ship horizontally", () => {
    const gameboard = new GameBoard();
    gameboard.placeShip(0, 0, 4, "horizontal");
    expect(gameboard.board[0][0].ship).toBeInstanceOf(Ship);
    expect(gameboard.board[0][1].ship).toBeInstanceOf(Ship);
    expect(gameboard.board[0][2].ship).toBeInstanceOf(Ship);
    expect(gameboard.board[0][3].ship).toBeInstanceOf(Ship);
    expect(gameboard.board[0][4].ship).toBeNull();
});

test("Gameboard should place ship vertically", () => {
    const gameboard = new GameBoard();
    gameboard.placeShip(0, 0, 4, "vertical");
    expect(gameboard.board[0][0].ship).toBeInstanceOf(Ship);
    expect(gameboard.board[1][0].ship).toBeInstanceOf(Ship);
    expect(gameboard.board[2][0].ship).toBeInstanceOf(Ship);
    expect(gameboard.board[3][0].ship).toBeInstanceOf(Ship);
    expect(gameboard.board[4][0].ship).toBeNull();
});

test("Gameboard should not place ship out of bounds", () => {
    const gameBoard = new GameBoard();
    expect(() => gameBoard.placeShip(0, 9, 2, "horizontal")).toThrow(Error);
    expect(() => gameBoard.placeShip(9, 0, 2, "vertical")).toThrow(Error);
});

test("Gameboard should not place ship on top of another ship", () => {
    const gameBoard = new GameBoard();
    gameBoard.placeShip(0, 0, 4, "horizontal");
    expect(() => gameBoard.placeShip(0, 0, 2, "vertical")).toThrow(Error);
    expect(() => gameBoard.placeShip(0, 0, 2, "horizontal")).toThrow(Error);
    expect(() => gameBoard.placeShip(0, 3, 1, "horizontal")).toThrow(Error);
})

test("Gameboard should receive attack with ship", () => {
    const gameBoard = new GameBoard();
    gameBoard.placeShip(0, 0, 4, "horizontal");
    gameBoard.receiveAttack(0, 0);
    expect(gameBoard.board[0][0].hit).toBe(true);
    expect(gameBoard.board[0][1].hit).toBe(false);
    expect(gameBoard.board[0][1].ship.isHit(0, 0)).toBe(true);
});

test("Gameboard should receive attack without ship", () => {
    const gameBoard = new GameBoard();
    gameBoard.receiveAttack(0, 0);
    expect(gameBoard.board[0][0].hit).toBe(true);
});

test("Gameboard should not receive attack on the same spot", () => {
    const gameBoard = new GameBoard();
    gameBoard.receiveAttack(0, 0);
    expect(() => gameBoard.receiveAttack(0, 0)).toThrow(Error);
});

test("Gameboard should keep track of missed attacks", () => {
    const gameBoard = new GameBoard();
    gameBoard.receiveAttack(0, 0);
    gameBoard.receiveAttack(0, 1);
    expect(gameBoard.missedAttacks).toEqual([{ x: 0, y: 0 }, { x: 0, y: 1 }]);
});

test("Gameboard should report whether all of the ships are sunk", () => {
    const gameBoard = new GameBoard();
    gameBoard.placeShip(0, 0, 2, "horizontal");
    gameBoard.receiveAttack(0, 0);
    gameBoard.receiveAttack(0, 1);
    expect(gameBoard.allShipsSunk()).toBe(true);

    gameBoard.placeShip(5, 5, 2, "vertical");
    gameBoard.receiveAttack(5, 5);
    expect(gameBoard.allShipsSunk()).toBe(false);
})
