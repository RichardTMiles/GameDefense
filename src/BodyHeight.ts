import canvas from "./Canvas";
import {GameFooterHeight} from "./Footer";
import GameHeaderHeight from "./HeaderHeight";

export default () => canvas.height - (GameHeaderHeight() + GameFooterHeight());