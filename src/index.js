import "./reset.css";
import "./style.css";
import Player from "./player";
import Display from "./display";

const player = new Player("player");
const computer = new Player("computer");
const display = new Display();

display.displayBoard(player.gameBoard, "player");
display.placeShipsDeterministic(player.gameBoard);
display.displayBoard(player.gameBoard, "player");
display.placeShipsDeterministic(computer.gameBoard);
display.displayBoard(computer.gameBoard, "computer");
