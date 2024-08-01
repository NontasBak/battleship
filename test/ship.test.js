import Ship from "../src/ship";

test("ship is hit", () => {
    const ship = new Ship(4);
    ship.hit();
    expect(ship.timesHit).toBe(1);

    ship.hit();
    expect(ship.timesHit).toBe(2);
});

test("ship is sunk", () => {
    const ship = new Ship(4);
    ship.hit();
    ship.hit();
    ship.hit();
    ship.hit();
    expect(ship.isSunk()).toBe(true);

    const ship2 = new Ship(2);
    ship2.hit();
    expect(ship2.isSunk()).toBe(false);
});
