import {getGameState} from "./GameDefense";
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



export function handleIEntity(entity: Entity): boolean {

    if (!entity.move()) { // If the projectile is destroyed, it will be removed by the filter next iteration of game loop

        return false;

    }

    entity.draw();

    return true;
}

