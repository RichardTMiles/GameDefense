import {GameFooterHeight} from "./Footer";
import GameHeaderHeight from "./HeaderHeight";
import {tGameState} from "./InitialState";

export const GameBodyHeight = () => window.innerHeight - (GameHeaderHeight() + GameFooterHeight());

const CellSize = (gameState: tGameState) => {

    const cellSize = false === gameState.switchXY
        ? (gameState.context.canvas.height - GameHeaderHeight() - GameFooterHeight()) / gameState.gameGrid.length
        : (gameState.context.canvas.width) / gameState.gameGrid[0].length;

    gameState.cellSize = cellSize

    return cellSize;

}

export default CellSize