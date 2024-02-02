import {tGameState} from "./State";
import Bezier from "./Bezier";

interface Point {
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

    constructor(start: Point, end: Point, increaseScore: number, increaseEnergy: number) {
        this.currentPosition = {x: start.x, y: start.y};
        this.endPosition = {x: end.x, y: end.y};
        this.speed = 2 + Math.random() * 3; // Random speed for variation
        this.size = 3 + Math.random() * .5; // Random size for variation
        this.arcPoints = Bezier(this.currentPosition, {x: end.x, y: start.y}, this.endPosition, 100);
        this.currentPointIndex = 0;
        this.increaseScore = increaseScore;
        this.increaseEnergy = increaseEnergy;
    }

    // Update the particle's position to the next point along the arc
    updatePosition(gameState: tGameState): boolean {
        if (this.currentPointIndex < this.arcPoints.length) {
            this.currentPosition = this.arcPoints[this.currentPointIndex++];
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
