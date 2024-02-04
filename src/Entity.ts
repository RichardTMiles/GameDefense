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

    abstract move(): boolean;

    abstract draw(): void;
}