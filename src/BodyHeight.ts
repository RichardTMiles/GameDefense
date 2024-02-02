import {GameFooterHeight} from "./Footer";
import GameHeaderHeight from "./HeaderHeight";

export default () => window.innerHeight - (GameHeaderHeight() + GameFooterHeight());