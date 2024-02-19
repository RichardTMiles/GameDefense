import Entity, {iEntityConstructorProps} from "./Entity";
import Particle, {Point} from "./Particle";
import {energyCirclePosition, scoreCirclePosition, elapsedTime} from "./Header";
import CellSize from "./CellSize";
import {tGameState} from "./InitialState";

// Define the positions of the orbs
// If you have specific positions for the orbs

export function timeBonusParticleBurst(start: Point, gameState: tGameState) {

    const energy: Point = energyCirclePosition()
    const score: Point = scoreCirclePosition()
    const cellSize = CellSize(gameState);
    const amount = Math.max(50, 2 * gameState.level);

    start.y += cellSize * 9

    for (let i = 0; i < amount; i++) {

        gameState.particles.push(new Particle({
            gameState,
            fillStyle: 'rgb(39,192,42)',
            callback(): void {
                gameState.energy += 10 * gameState.level;
            },
            start,
            control: i % 2 ? {
                x: start.x + (Math.random() * 20 - 10) * cellSize,
                y: energy.y + (Math.random() * 10 - 5) * cellSize + (cellSize * 20)
            } : {
                x: energy.x + (Math.random() * 20 - 10) * cellSize,
                y: start.y + (Math.random() * 10 - 5) * cellSize + (cellSize * 20)
            },
            end: energy
        }));

        gameState.particles.push(new Particle({
            gameState,
            fillStyle: 'rgb(0,207,250)',
            callback(): void {
                gameState.score += 10 * gameState.level;
            },
            start,
            control: i % 2 ? {
                x: start.x + (Math.random() * 20 - 10) * cellSize,
                y: start.y + (Math.random() * 10 - 5) * cellSize + (cellSize * 20)
            } : {
                x: score.x + (Math.random() * 20 - 10) * cellSize,
                y: start.y + (Math.random() * 10 - 5) * cellSize + (cellSize * 20)
            },
            end: score
        }));

    }

}

export function createOrbGradient(ctx: CanvasRenderingContext2D, x: number, y: number, radius: number, color1: string = 'rgb(172,39,192)', color2: string = 'rgba(39, 66, 66, .8)') {

    // Create a radial gradient (inner circle to outer circle)
    let gradient = ctx.createRadialGradient(x, y, radius * 0.5, x, y, radius);

    // Add color stops
    gradient.addColorStop(0, color1); // white center

    // fading to transparent
    gradient.addColorStop(1, color2);

    return gradient;

}

export default class Targets extends Entity {

    private levelBonusGiven = -1;
    public destroyed: boolean = false;
    key: number = 0;

    constructor({x, y, gameState}: iEntityConstructorProps) {
        super({gameState, x, y});
        this.key = gameState.gameTargets.length;
    }

    move(): boolean {

        // the targets never move x,y position and never actually get removed from the game state
        // the oscillation effect is handled in the draw method since it is a visual effect not positional
        return true;

    }

    draw() {

        const gameState = this.gameState;

        const ctx = gameState.context;

        const cellSize = gameState.cellSize;

        const orbRadius = cellSize * 4; // Adjust the radius of the orbs here

        const currentTime = Date.now(); // Get current time to create the oscillation effect

        const orbX = this.x * cellSize + cellSize / 2;

        // Base targetY position, this is not the floating target but the base position
        let orbY = this.y * cellSize + cellSize / 2;

        ctx.fillStyle = createOrbGradient(ctx, orbX, orbY, orbRadius / 2, 'rgb(172,39,192)', 'rgb(100,225,100)'); // Assuming createOrbGradient is defined elsewhere

        ctx.beginPath();

        ctx.arc(orbX, orbY, orbRadius / 2, 0, Math.PI * 2);

        ctx.fill();

        // don't show floating target if the target is destroyed
        if (this.destroyed) {

            return;

        }

        // Oscillation
        const oscillationAmplitude = 10; // Max vertical movement in pixels. Adjust as needed.

        const oscillationSpeed = 0.002; // Speed of oscillation. Adjust as needed.

        // Calculate the vertical offset using a sine wave based on the current time
        const verticalOffset = (this.key % 2 ? Math.sin(currentTime * oscillationSpeed) : Math.cos(currentTime * oscillationSpeed)) * oscillationAmplitude;

        // Apply the vertical offset to orbY for the rising and falling effect
        orbY += verticalOffset;

        // Draw the orb with its oscillating position
        ctx.fillStyle = createOrbGradient(ctx, orbX, orbY - cellSize * 2, orbRadius); // Assuming createOrbGradient is defined elsewhere

        ctx.beginPath();

        ctx.arc(orbX, orbY - cellSize * 2, orbRadius, 0, Math.PI * 2);

        ctx.fill();

        const levelBonus = this.levelBonusGiven < gameState.level

        if (levelBonus) {

            this.levelBonusGiven++;

            timeBonusParticleBurst({x: orbX, y: orbY}, gameState);

        }

    }

}




