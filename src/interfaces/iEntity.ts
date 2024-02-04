import {tGameState} from "../InitialState";


interface iEntity {
    move(gameState: tGameState): boolean;
    draw(ctx: CanvasRenderingContext2D): void;
}

export default iEntity;