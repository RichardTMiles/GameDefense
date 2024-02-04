import CellSize from "./CellSize";
import {tGameState} from "./InitialState";
import {rotateMatrix90Clockwise} from "./MatrixOperations";
import {gameBodyTotalYScroll} from "./Scroll";

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

            gameState.offsetX = 0;

            CellSize(gameState);

            gameState.offsetY = -gameBodyTotalYScroll(gameState);

            console.log('switchXY scroll 2 bottom', gameState, gameBodyTotalYScroll(gameState))

        }

        return;

    }

    if (gameState.switchXY) {

        gameState.offsetY = 0;

        gameState.offsetX = 0;

        gameState.switchXY = false;

        console.log('switchXY 00', gameState)

        gameState.gameGrid = rotateMatrix90Clockwise(gameState.gameGrid);

    }

    CellSize(gameState);

}
