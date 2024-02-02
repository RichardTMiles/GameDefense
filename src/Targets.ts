import cellSize from "./CellSize";
import Particle, {Point} from "./Particle";
import {energyCirclePosition, secondsElapsed} from "./Header";
import CellSize from "./CellSize";
import {tGameState} from "./State";

// Define the positions of the orbs
// If you have specific positions for the orbs
import tGridPosition from "./tGridPosition";

const Targets = [
    {x: 60, y: 17, destroyed: false},
    {x: 93, y: 17, destroyed: false},
    {x: 139, y: 17, destroyed: false},
    {x: 156, y: 4, destroyed: false},
    {x: 169, y: 4, destroyed: false},
];


export default Targets;

let timeBonusesGiven = 0;

let timeBonus = -1;

export function timeBonusParticleBurst(start: Point, end: Point, gameState: tGameState) {

    timeBonusesGiven++;

    const cellSize = CellSize(gameState);

    const amount = Math.max(50, 2 * gameState.level);

    for (let i = 0; i < amount; i++) {

        gameState.particles.push(new Particle({
                x: start.x ,
                y: start.y + (cellSize * 9),
            }, i % 2 ? {
                x: start.x + (Math.random() * 20 - 10) * cellSize,
                y: start.y + (Math.random() * 10 - 5) * cellSize + (cellSize * 20)
            } : {
                x: end.x + (Math.random() * 20 - 10) * cellSize,
                y: start.y + (Math.random() * 10 - 5) * cellSize + (cellSize * 20)
            },
            end, 100 * gameState.level, 2 * gameState.level));

    }

}

// Function to create a radial gradient for orbs
function createOrbGradient(ctx: CanvasRenderingContext2D, x: number, y: number, radius: number, color1: string = 'rgb(172,39,192)', color2: string = 'rgba(39, 66, 66, .8)') {

    // Create a radial gradient (inner circle to outer circle)
    let gradient = ctx.createRadialGradient(x, y, radius * 0.5, x, y, radius);

    // Add color stops
    gradient.addColorStop(0, color1); // white center

    gradient.addColorStop(1, color2); // fading to transparent

    return gradient;

}

export function DrawGameTargets(ctx: CanvasRenderingContext2D, gameState: tGameState) {

    const cellSize = CellSize(gameState);

    const orbRadius = cellSize * 4; // Adjust the radius of the orbs here

    const currentTime = Date.now(); // Get current time to create the oscillation effect

    const seconds = secondsElapsed(gameState); // Assuming SecondsElapsed is defined elsewhere

    const elapsedTimeBonus = timeBonus === seconds ? false : 0 === seconds % 14 + timeBonusesGiven; // Assuming SecondsElapsed is defined elsewhere

    gameState.gameTargets.forEach((target, index) => {

        const orbX = target.x * cellSize - cellSize / 2;

        // Base orbY position
        let orbY = target.y * cellSize;

        const baseOffset = orbRadius / 3;

        ctx.fillStyle = createOrbGradient(ctx, orbX, orbY + baseOffset, orbRadius / 2, 'rgb(172,39,192)', 'rgb(100,225,100)'); // Assuming createOrbGradient is defined elsewhere

        ctx.beginPath();

        ctx.arc(orbX, orbY + baseOffset, orbRadius / 2, 0, Math.PI * 2);

        ctx.fill();

        if (target.destroyed) {

            return;

        }

        // Oscillation
        const oscillationAmplitude = 10; // Max vertical movement in pixels. Adjust as needed.

        const oscillationSpeed = 0.002; // Speed of oscillation. Adjust as needed.

        // Calculate the vertical offset using a sine wave based on the current time
        const verticalOffset = (index % 2 ? Math.sin(currentTime * oscillationSpeed) : Math.cos(currentTime * oscillationSpeed)) * oscillationAmplitude;

        // Apply the vertical offset to orbY for the rising and falling effect
        orbY += verticalOffset;

        // Draw the orb with its oscillating position
        ctx.fillStyle = createOrbGradient(ctx, orbX, orbY, orbRadius); // Assuming createOrbGradient is defined elsewhere

        ctx.beginPath();

        ctx.arc(orbX, orbY, orbRadius, 0, Math.PI * 2);

        ctx.fill();

        if (elapsedTimeBonus) {

            timeBonusParticleBurst({x: orbX, y: orbY}, energyCirclePosition(), gameState);

        }

    });

    if (elapsedTimeBonus) {

        timeBonus = seconds;

    }

}

