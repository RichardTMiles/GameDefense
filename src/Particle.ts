import FPS from "./FPS";
import {tGameState} from "./InitialState";
import Bezier from "./Bezier";

export interface Point {
    x: number;
    y: number;
}


export interface tParticle {
    start: Point;
    control: Point;
    end: Point;
    callback?: () => void;
    fillStyle?: string;
}

export default class Particle {

    speed: number;
    size: number;
    currentPosition: Point;
    endPosition: Point;
    arcPoints: Point[];
    currentPointIndex: number;
    callback?: () => void;
    fillStyle: string;

    constructor({start, control,callback, end, fillStyle = 'rgb(39,192,42)'}: tParticle) {
        this.currentPosition = {x: start.x, y: start.y};
        this.endPosition = {x: end.x, y: end.y};
        this.speed = .5 + Math.random() * 2; // Random speed for variation
        this.size = 3 + Math.random() * 2; // Random size for variation
        const fps = FPS();
        this.arcPoints = Bezier(this.currentPosition, control, this.endPosition, fps < 30 ? 100 / fps : 50);
        this.currentPointIndex = 0;
        this.fillStyle = fillStyle;
        this.callback = callback;
    }

    // Update the particle's position to the next point along the arc
    updatePosition(): boolean {

        // Increment currentPointIndex by speed
        this.currentPointIndex += this.speed;

        if (this.currentPointIndex < this.arcPoints.length) {

            // Update the current position to the new point.
            this.currentPosition = this.arcPoints[Math.floor(this.currentPointIndex)];

            return true;

        }

        // Additional logic here for what happens when the arc is completed
        this.callback?.()

        return false;

    }

    draw(ctx: CanvasRenderingContext2D) {
        ctx.beginPath();
        ctx.arc(this.currentPosition.x, this.currentPosition.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.fillStyle;
        ctx.fill();
    }

}
