import Entity from "./Entity";
import CellSize from "./CellSize";
import {tGameState} from "./InitialState";
import {rotateMatrix90Clockwise} from "./MatrixOperations";
import {gameBodyTotalYScroll} from "./Scroll";

function switchGameEntitiesXY(gameState: tGameState) {
    //const switchXY = (entity: Entity) => entity.switchXY();

    gameState.gameTargets.forEach(target => {
        console.log({
            ...target,
            x: target.y,
            y: target.x,
        })
        return {
            ...target,
            x: target.y,
            y: target.x,
        }
    });

}


export function rotatePoint90Clockwise(x: number, y:number) {
    const M = this.gameState.gameGrid[0].length;
    //const N = this.gameState.gameGrid.length;

    // For a 90 degree clockwise rotation, the new x is the original y
    // And the new y is M minus the original x minus 1 (due to zero-indexing)
    return { x: y, y: (M - 1) - x };
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
            gameState.gameGrid = rotateMatrix90Clockwise(rotateMatrix90Clockwise(rotateMatrix90Clockwise(gameState.gameGrid)));

            gameState.gameTargets = gameState.gameTargets.map(target => {
                return {
                    ...target,
                    x: target.y,
                    y: target.x,
                }
            })

            gameState.offsetX = 0;

            CellSize(gameState);

            gameState.offsetY = -gameBodyTotalYScroll(gameState);

            console.log('switchXY scroll 2 bottom', gameState, gameBodyTotalYScroll(gameState))

            switchGameEntitiesXY(gameState)

            return;

        }

    } else if (gameState.switchXY) {

        gameState.offsetY = 0;

        gameState.offsetX = 0;

        gameState.switchXY = false;

        console.log('switchXY 00', gameState)

        gameState.gameGrid = rotateMatrix90Clockwise(gameState.gameGrid);

        CellSize(gameState);

        switchGameEntitiesXY(gameState)

        return;

    }



    CellSize(gameState);

}
