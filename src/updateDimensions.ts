import {isCenterOf5x5GridOf0s} from "Grid";
import Entity from "./Entity";
import CellSize from "./CellSize";
import {tGameState} from "InitialState";
import {rotateMatrix90Clockwise, rotateMatrix90CounterClockwise} from "MatrixOperations";
import {gameBodyTotalYScroll} from "Scroll";


// these operations are in context of 0,0 being top left after the rotation. Thus, after grid rotation and translation
export function rotatePoint90CounterClockwise(gameState: tGameState, x: number, y: number) {
    const N = gameState.gameGrid.length;
    let newX = N - 1 - x;
    return { x: y, y: newX };
}
export function rotatePoint90Clockwise(gameState: tGameState, x: number, y: number) {
    const M = gameState.gameGrid[0].length;
    let newY = M - 1 - y;
    return { x: newY, y: x };
}


function switchGameEntitiesXY(gameState: tGameState) {

    const switchXY = gameState.switchXY ? rotatePoint90CounterClockwise : rotatePoint90Clockwise;

    gameState.spawnLocations = gameState.spawnLocations.map(spawnLocation => {
        const { x, y } = switchXY(gameState, spawnLocation.x, spawnLocation.y);
        spawnLocation.x = x;
        spawnLocation.y = y;
        return spawnLocation
    })

    gameState.gameTargets.forEach(target => target.switchXY())

    gameState.turrets.forEach(turret => turret.switchXY())

    gameState.monsters.forEach(monster => monster.switchXY())

    gameState.projectiles.forEach(projectile => projectile.switchXY())

}

export function updateDimensions(gameState: tGameState): void {

    // update the canvas size each frame, this handles window resizing
    gameState.context.canvas.height = window.innerHeight;

    // update the canvas width each frame, this handles window resizing
    gameState.context.canvas.width = window.innerWidth;

    if (gameState.context.canvas.height > gameState.context.canvas.width) {

        if (false === gameState.switchXY) {

            gameState.switchXY = true;

            //gameState.gameGrid = rotateMatrix90Clockwise(rotateMatrix90Clockwise(rotateMatrix90Clockwise(gameState.gameGrid)));
            gameState.gameGrid = rotateMatrix90CounterClockwise(gameState.gameGrid);

            switchGameEntitiesXY(gameState);

            gameState.offsetX = 0;

            CellSize(gameState);

            gameState.offsetY = -gameBodyTotalYScroll(gameState);

            console.log('switchXY scroll 2 bottom', gameState, gameBodyTotalYScroll(gameState))

            return;

        }

    } else if (gameState.switchXY) {

        gameState.offsetY = 0;

        gameState.offsetX = 0;

        gameState.switchXY = false;

        gameState.gameGrid = rotateMatrix90Clockwise(gameState.gameGrid);

        switchGameEntitiesXY(gameState);

        CellSize(gameState);

        return;

    }

    CellSize(gameState);

}
