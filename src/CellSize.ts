import {GameFooterHeight} from "./Footer";
import {tGameState} from "./State";
import GameHeaderHeight from "./HeaderHeight";

const CellSize = (gameState: tGameState) => (window.innerHeight - GameHeaderHeight() - GameFooterHeight()) / gameState.gameGrid.length;

export default CellSize