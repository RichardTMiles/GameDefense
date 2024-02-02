import {tGameState} from "./InitialState";
import Bezier from "./Bezier";

export interface Point {
    x: number;
    y: number;
}


export default class Particle {

    speed: number;
    size: number;
    currentPosition: Point;
    endPosition: Point;
    arcPoints: Point[];
    currentPointIndex: number;
    increaseScore: number;
    increaseEnergy: number;

    constructor(start: Point, control: Point, end: Point, increaseScore: number, increaseEnergy: number) {
        this.currentPosition = {x: start.x, y: start.y};
        this.endPosition = {x: end.x, y: end.y};
        this.speed = .5 + Math.random() * 2; // Random speed for variation
        this.size = 3 + Math.random() * 2; // Random size for variation
        this.arcPoints = Bezier(this.currentPosition, control, this.endPosition, 100);
        this.currentPointIndex = 0;
        this.increaseScore = increaseScore;
        this.increaseEnergy = increaseEnergy;
    }

    // Update the particle's position to the next point along the arc
    updatePosition(gameState: tGameState): boolean {

        // Increment currentPointIndex by speed
        this.currentPointIndex += this.speed;

        if (this.currentPointIndex < this.arcPoints.length) {

            // Update the current position to the new point.
            this.currentPosition = this.arcPoints[Math.floor(this.currentPointIndex)];

            return true;

        }

        // Additional logic here for what happens when the arc is completed
        gameState.score += this.increaseScore;

        gameState.energy += this.increaseEnergy;

        return false;

    }

    draw(ctx: CanvasRenderingContext2D) {
        ctx.beginPath();
        ctx.arc(this.currentPosition.x, this.currentPosition.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = 'rgb(39,192,42)';
        ctx.fill();
    }

}
