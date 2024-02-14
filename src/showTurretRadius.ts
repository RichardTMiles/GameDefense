import CellSize from "./CellSize";
import {getGameState} from "./Game";
import {getGameGridPosition, isGridSpaceTakenWithTurret, isSpaceAvailable} from "./Position";
import tGridPosition from "./tGridPosition";

export default function showTurretRadius(ctx: CanvasRenderingContext2D, position: tGridPosition) {
    const gameState = getGameState();

    const mouseX = position.x;
    const mouseY = position.y;
    const gameGridPosition = getGameGridPosition(mouseX, mouseY);

    if (undefined === gameGridPosition) {
        return;
    }

    const {x, y} = gameGridPosition;
    const cellSize = CellSize(gameState);

    // Assuming gameState.selectedTurret is correctly initialized
    const turret = gameState.selectedTurret;

    // Adjust to draw the turret placement box with mouse in the upper left
    if (isSpaceAvailable(x, y, turret.w, turret.h, gameState)) {

        // Show the turret's effective range
        const turretRadius = turret.range * cellSize;

        // Calculate the center based on the full turret size
        const centerX = x * cellSize + turret.w * cellSize / 2;
        const centerY = y * cellSize + turret.h * cellSize / 2;

        // Draw the turret radius
        ctx.beginPath();
        ctx.arc(centerX, centerY, turretRadius, 0, 2 * Math.PI, false);
        ctx.fillStyle = 'rgba(255, 0, 0, 0.15)'; // Semi-transparent fill for the radius
        ctx.fill();

        // Draw the placement box for the turret itself
        ctx.strokeStyle = gameState.selectedTurret.fillStyle; // Red border for the placement box
        ctx.strokeRect(x * cellSize, y * cellSize, turret.w * cellSize, turret.h * cellSize);

    } /*else if (isGridSpaceTakenWithTurret(x, y, gameState)) {

        console.log('Turret already placed here');

        // Check if the space belongs to an already placed turret
        const existingTurret = gameState.turrets.find(t => t.x === x && t.y === y);

        if (existingTurret) {

            // If the turret is clicked a second time, upgrade the turret
            if (turret === existingTurret) {

                existingTurret.upgrade();

            } else {
                // Update gameState.selectedTurret to be that turret entity with an upgrade cost
                gameState.selectedTurret = existingTurret;

            }

        }

    }*/

}