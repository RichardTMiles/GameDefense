import {GameFooterHeight} from "./GameFooter";
import GameHeaderHeight from "./GameHeaderHeight";

export default () => window.innerHeight - (GameHeaderHeight() + GameFooterHeight());