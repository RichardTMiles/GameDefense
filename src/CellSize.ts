import {GameFooterHeight} from "./Footer";
import GameHeaderHeight from "./HeaderHeight";
import {tGameState} from "./InitialState";
export const GameBodyHeight = () => window.innerHeight - (GameHeaderHeight() + GameFooterHeight());

const CellSize = (gameState: tGameState) => {
    return (gameState.context.canvas.height - GameHeaderHeight() - GameFooterHeight()) / gameState.gameGrid.length;
}

export default CellSize