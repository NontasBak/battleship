import GameBoard from "../src/gameBoard";
import Ship from "../src/ship";

let gameBoard;
beforeEach(() => {
    gameBoard = new GameBoard();
});

test("Gameboard should place ship horizontally", () => {
    gameBoard.placeShip(0, 0, 4, "horizontal");
    expect(gameBoard.board[0][0].ship).toBeInstanceOf(Ship);
    expect(gameBoard.board[0][1].ship).toBeInstanceOf(Ship);
    expect(gameBoard.board[0][2].ship).toBeInstanceOf(Ship);
    expect(gameBoard.board[0][3].ship).toBeInstanceOf(Ship);
    expect(gameBoard.board[0][4].ship).toBeNull();
});

test("Gameboard should place ship vertically", () => {
    gameBoard.placeShip(0, 0, 4, "vertical");
    expect(gameBoard.board[0][0].ship).toBeInstanceOf(Ship);
    expect(gameBoard.board[1][0].ship).toBeInstanceOf(Ship);
    expect(gameBoard.board[2][0].ship).toBeInstanceOf(Ship);
    expect(gameBoard.board[3][0].ship).toBeInstanceOf(Ship);
    expect(gameBoard.board[4][0].ship).toBeNull();
});

test("Gameboard should not place ship out of bounds", () => {
    expect(() => gameBoard.placeShip(0, 9, 2, "horizontal")).toThrow(Error);
    expect(() => gameBoard.placeShip(9, 0, 2, "vertical")).toThrow(Error);
});

test("Gameboard should not place ship on top of another ship", () => {
    gameBoard.placeShip(0, 0, 4, "horizontal");
    expect(() => gameBoard.placeShip(0, 0, 2, "vertical")).toThrow(Error);
    expect(() => gameBoard.placeShip(0, 0, 2, "horizontal")).toThrow(Error);
    expect(() => gameBoard.placeShip(0, 3, 1, "horizontal")).toThrow(Error);
});

test("Gameboard should receive attack with ship", () => {
    gameBoard.placeShip(0, 0, 4, "horizontal");
    gameBoard.receiveAttack(0, 0);
    expect(gameBoard.board[0][0].hit).toBe(true);
    expect(gameBoard.board[0][1].hit).toBe(false);
    expect(gameBoard.board[0][1].ship.isHit(0, 0)).toBe(true);
});

test("Gameboard should receive attack without ship", () => {
    gameBoard.receiveAttack(0, 0);
    expect(gameBoard.board[0][0].hit).toBe(true);
});

test("Gameboard should not receive attack on the same spot", () => {
    gameBoard.receiveAttack(0, 0);
    expect(() => gameBoard.receiveAttack(0, 0)).toThrow(Error);
});

test("Gameboard should keep track of missed attacks", () => {
    gameBoard.receiveAttack(0, 0);
    gameBoard.receiveAttack(0, 1);
    expect(gameBoard.missedAttacks).toEqual([
        { x: 0, y: 0 },
        { x: 0, y: 1 },
    ]);
});

test("Gameboard should report whether all of the ships are sunk", () => {
    gameBoard.placeShip(0, 0, 2, "horizontal");
    gameBoard.receiveAttack(0, 0);
    gameBoard.receiveAttack(0, 1);
    expect(gameBoard.allShipsSunk()).toBe(true);

    gameBoard.placeShip(5, 5, 2, "vertical");
    gameBoard.receiveAttack(5, 5);
    expect(gameBoard.allShipsSunk()).toBe(false);
});
