import Ship from "../src/ship";

let ship;
let ship2;
beforeEach(() => {
    ship = new Ship(4);
    ship2 = new Ship(2);
});

test("Ship is hit", () => {
    ship.hit(0, 0);
    expect(ship.timesHit).toBe(1);
    expect(ship.isHit(0, 0)).toBe(true);

    ship.hit(0, 1);
    expect(ship.timesHit).toBe(2);
    expect(ship.isHit(0, 1)).toBe(true);
});

test("Ship is sunk", () => {
    ship.hit();
    ship.hit();
    ship.hit();
    ship.hit();
    expect(ship.isSunk).toBe(true);

    ship2.hit();
    expect(ship2.isSunk).toBe(false);
});
