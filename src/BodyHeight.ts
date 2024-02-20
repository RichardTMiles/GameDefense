import State from "./State.ts";
import {GameFooterHeight} from "./Footer";
import GameHeaderHeight from "./HeaderHeight";

export default () => State.canvas.height - (GameHeaderHeight() + GameFooterHeight());

