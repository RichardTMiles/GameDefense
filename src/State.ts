import {tGameState} from "./InitialState.ts";


export default abstract class State {
    static canvas: HTMLCanvasElement;
    static context: CanvasRenderingContext2D;
    static gameState: tGameState;
    protected constructor() {

    }
}

