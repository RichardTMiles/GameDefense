import {GameFooterHeight} from "./GameFooter";
import {tGameState} from "./GamesState";
import GameHeaderHeight from "./GameHeaderHeight";

const GameCellSize = (gameState: tGameState) => (window.innerHeight - GameHeaderHeight() - GameFooterHeight()) / gameState.gameGrid.length;

export default GameCellSize