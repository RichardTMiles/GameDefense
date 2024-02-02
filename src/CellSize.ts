import {getGameState} from "./Game";
import {GameFooterHeight} from "./Footer";
import {tGameState} from "./InitialState";
import GameHeaderHeight from "./HeaderHeight";

const CellSize = (gameState: tGameState = null) => {
    gameState = getGameState()
    return (window.innerHeight - GameHeaderHeight() - GameFooterHeight()) / gameState.gameGrid.length;
}

export default CellSize