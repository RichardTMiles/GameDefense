import {tGameState} from "./InitialState";
import {GameBodyHeight} from "./CellSize";

// Scroll function to update offsetX
import {getGameState} from "./GameDefense";

export const scrollGridX = (amount: number) => {

    const gameState = getGameState()

    gameState.offsetX += amount;

    // Optionally add limits to prevent scrolling too far left or right
    gameState.offsetX = Math.max(0, Math.min(gameState.offsetX,
        gameState.cellSize * gameState.gameGrid[0].length - window.innerWidth));

}


export const gameBodyTotalYScroll = (gameState:tGameState) => {
    return gameState.cellSize * gameState.gameGrid.length - GameBodyHeight();
}

export const scrollGridY = (amount: number) => {

    const gameState = getGameState()

    gameState.offsetY += amount;

    const totalGameY = gameBodyTotalYScroll(gameState);

    if (totalGameY < gameState.offsetY) {

        gameState.offsetY = totalGameY;

    } else {

        gameState.offsetY = Math.min(0, Math.max(gameState.offsetY,
            -totalGameY));


    }

}