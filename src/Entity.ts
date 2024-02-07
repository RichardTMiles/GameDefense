import {getGameState} from "./Game";
import {tGameState} from "./InitialState";


export interface iEntityConstructorProps {
    x?: number;
    y?: number;
    gameState?: tGameState;
}

export default abstract class Entity {
    x: number;
    y: number;
    gameState: tGameState;

    constructor({x = 0, y = 0, gameState = getGameState()}: iEntityConstructorProps) {
        this.x = x;
        this.y = y;
        this.gameState = gameState;
    }



    rotatePoint90Clockwise(x: number, y:number) {
        const M = this.gameState.gameGrid[0].length;
        //const N = this.gameState.gameGrid.length;

        // For a 90 degree clockwise rotation, the new x is the original y
        // And the new y is M minus the original x minus 1 (due to zero-indexing)
        return { x: y, y: (M - 1) - x };
    }


    abstract move(): boolean;

    abstract draw(): void;
}