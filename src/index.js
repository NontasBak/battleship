import "./reset.css";
import "./style.css";
import Player from "./player";
import Display from "./display";

const player = new Player("player");
const computer = new Player("computer");
const display = new Display(player, computer);

player.gameBoard.placeShipRandomly();
computer.gameBoard.placeShipRandomly();
display.displayBoardPlayer(player.gameBoard);
display.displayBoardComputer(computer.gameBoard);
