// this essentially sets up a singly linked list
import {getGameState} from "./Game";
import HeaderHeight from "./HeaderHeight";
import CellSize from "./CellSize";
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

export function getGameGridPosition(x: number, y: number): tGridPosition {
    const gameState = getGameState();
    const headerHeight = HeaderHeight();
    const cellSize = CellSize(gameState);
    y -= headerHeight + gameState.offsetY;
    x += gameState.offsetX;
    const gridX = Math.floor(x / cellSize);
    const gridY = Math.floor(y / cellSize);

    if (undefined === gameState.gameGrid[gridY]
        || undefined === gameState.gameGrid[gridY][gridX]) {
        return undefined;
    }

    return {x: gridX, y: gridY};
}

export function isSpaceAvailable(gridX: number, gridY: number) {
    const gameState = getGameState();
    return gameState.gameGrid[gridY] && gameState.gameGrid[gridY][gridX] === 2;
}