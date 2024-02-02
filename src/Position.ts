// this essentially sets up a singly linked list
import HeaderHeight from "./HeaderHeight";
import CellSize from "./CellSize";
import gamesState from "./State";
import tGridPosition from "./tGridPosition";

export default class Position {
    public position: tGridPosition;
    public distance: number;
    public parent: null | Position;

    constructor(position: tGridPosition, distance: number, parent: null | Position = null) {
        this.position = position;
        this.distance = distance;
        this.parent = parent;
    }
}

export function getGameGridPosition(x: number, y: number) {
    const headerHeight = HeaderHeight();
    const cellSize = CellSize();
    y -= headerHeight;
    const gridX = Math.floor(x / cellSize);
    const gridY = Math.floor(y / cellSize);
    return {gridX, gridY};
}

export function isSpaceAvailable(gridX: number, gridY: number) {
    return gamesState.gameGrid[gridY] && gamesState.gameGrid[gridY][gridX] === 2;
}