import State from "./State.ts";
import {tGameState} from "./InitialState";
import {GameBodyHeight} from "./CellSize";

// Scroll function to update offsetX

export const scrollGridX = (amount: number) => {

    const gameState = State.gameState;

    gameState.offsetX += amount;

    // Optionally add limits to prevent scrolling too far left or right
    gameState.offsetX = Math.max(0, Math.min(gameState.offsetX,
        gameState.cellSize * gameState.gameGrid[0].length - window.innerWidth));

}


export const gameBodyTotalYScroll = (gameState:tGameState) => {
    return gameState.cellSize * gameState.gameGrid.length - GameBodyHeight();
}

export const scrollGridY = (amount: number) => {

    const gameState = State.gameState;

    gameState.offsetY += amount;

    const totalGameY = gameBodyTotalYScroll(gameState);

    if (totalGameY < gameState.offsetY) {

        gameState.offsetY = totalGameY;

    } else {

        gameState.offsetY = Math.min(0, Math.max(gameState.offsetY,
            -totalGameY));


    }

}