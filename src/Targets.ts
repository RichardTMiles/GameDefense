import CellSize from "./CellSize";
import {tGameState} from "./State";

// Define the positions of the orbs
// If you have specific positions for the orbs
import tGridPosition from "./tGridPosition";

let Targets = [
    {x: 60, y: 17},
    {x: 93, y: 17},
    {x: 139, y: 17},
    {x: 156, y: 4},
    {x: 169, y: 4},
];


export default Targets;

// Function to create a radial gradient for orbs
function createOrbGradient(ctx: CanvasRenderingContext2D, x: number, y: number, radius: number) {

    // Create a radial gradient (inner circle to outer circle)
    let gradient = ctx.createRadialGradient(x, y, radius * 0.5, x, y, radius);

    // Add color stops
    gradient.addColorStop(0, 'rgb(172,39,192)'); // white center

    gradient.addColorStop(1, 'rgba(39, 66, 66, .8)'); // fading to transparent

    return gradient;

}

export function DrawGameTargets(ctx: CanvasRenderingContext2D, gameState: tGameState) {

    const cellSize = CellSize(gameState);

    const orbRadius = cellSize * 4; // You can adjust the radius of the orbs here

    gameState.gameTargets.forEach(orb => {

        // Calculate the orb's position, adjust by offsetX for horizontal scrolling
        const orbX = orb.x * cellSize - cellSize / 2;

        const orbY = orb.y * cellSize;

        // Draw the orb
        ctx.fillStyle = createOrbGradient(ctx, orbX, orbY, orbRadius); // Set the orb color

        ctx.beginPath();

        ctx.arc(orbX, orbY, orbRadius, 0, Math.PI * 2);

        ctx.fill();

    });

    /*// Update turrets and draw them
    for (const turret of gameState.turrets) {

        turret.update(gameState.monsters);

        ctx.fillStyle = 'rgba(172,39,192,0.66)'; // Color of the monster

        ctx.beginPath();

        ctx.fillRect(turret.x * cellSize, turret.y * cellSize, cellSize, cellSize);

        ctx.fill();

    }*/

}