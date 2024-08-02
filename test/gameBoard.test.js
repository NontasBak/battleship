import GameBoard from "../src/gameBoard";
import Ship from "../src/ship";

let gameBoard;
beforeEach(() => {
    gameBoard = new GameBoard();
});

test("Gameboard should place ship horizontally", () => {
    const ship = new Ship(4);
    gameBoard.placeShip(0, 0, ship, "horizontal");
    expect(gameBoard.board[0][0].ship).toBeInstanceOf(Ship);
    expect(gameBoard.board[0][1].ship).toBeInstanceOf(Ship);
    expect(gameBoard.board[0][2].ship).toBeInstanceOf(Ship);
    expect(gameBoard.board[0][3].ship).toBeInstanceOf(Ship);
    expect(gameBoard.board[0][4].ship).toBeNull();
});

test("Gameboard should place ship vertically", () => {
    const ship = new Ship(4);
    gameBoard.placeShip(0, 0, ship, "vertical");
    expect(gameBoard.board[0][0].ship).toBeInstanceOf(Ship);
    expect(gameBoard.board[1][0].ship).toBeInstanceOf(Ship);
    expect(gameBoard.board[2][0].ship).toBeInstanceOf(Ship);
    expect(gameBoard.board[3][0].ship).toBeInstanceOf(Ship);
    expect(gameBoard.board[4][0].ship).toBeNull();
});

test("Gameboard should not place ship out of bounds", () => {
    const ship = new Ship(2);
    expect(() => gameBoard.placeShip(0, 9, ship, "horizontal")).toThrow(Error);
    expect(() => gameBoard.placeShip(9, 0, ship, "vertical")).toThrow(Error);
});

test("Gameboard should not place ship on top of another ship", () => {
    const ship = new Ship(4);
    gameBoard.placeShip(0, 0, ship, "horizontal");
    expect(() => gameBoard.placeShip(0, 0, new Ship(2), "vertical")).toThrow(
        Error
    );
    expect(() => gameBoard.placeShip(0, 0, new Ship(2), "horizontal")).toThrow(
        Error
    );
    expect(() => gameBoard.placeShip(0, 3, new Ship(1), "horizontal")).toThrow(
        Error
    );
});

test("Gameboard should receive attack with ship", () => {
    const ship = new Ship(4);
    gameBoard.placeShip(0, 0, ship, "horizontal");
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
    const ship = new Ship(2);
    gameBoard.placeShip(0, 0, ship, "horizontal");
    gameBoard.receiveAttack(0, 0);
    gameBoard.receiveAttack(0, 1);
    expect(gameBoard.allShipsSunk()).toBe(true);

    const ship2 = new Ship(2);
    gameBoard.placeShip(5, 5, ship2, "vertical");
    gameBoard.receiveAttack(5, 5);
    expect(gameBoard.allShipsSunk()).toBe(false);
});
