// this essentially sets up a singly linked list
import {tGameState} from "./InitialState";
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

export function isSpaceAvailable(gridX: number, gridY: number, w: number, h: number, gameState: tGameState = getGameState()): boolean {
    // Check each cell in the area defined by w and h for availability
    for (let offsetY = 0; offsetY < h; offsetY++) {
        for (let offsetX = 0; offsetX < w; offsetX++) {
            const checkX = gridX + offsetX;
            const checkY = gridY + offsetY;
            // Ensure we're within the grid boundaries
            if (checkY >= gameState.gameGrid.length || checkX >= gameState.gameGrid[0].length) {
                return false; // Part of the turret would be outside the grid
            }
            // Check if the space is not available (not marked as '2')
            if (gameState.gameGrid[checkY][checkX] !== 2) {
                return false; // The space is not available for turret placement
            }
        }
    }
    return true; // The entire area is available
}