import GameDefense from "./GameDefense.ts";
import {GameFooterHeight} from "./Footer";
import GameHeaderHeight from "./HeaderHeight";

export default () => GameDefense.canvas.height - (GameHeaderHeight() + GameFooterHeight());

