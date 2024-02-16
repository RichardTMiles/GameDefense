import CellSize from "./CellSize";
import {getGameState} from "./GameDefense";
import {getGameGridPosition, isGridSpaceTakenWithTurret, isSpaceAvailable} from "./Position";
import tGridPosition from "./tGridPosition";

export default function showTurretRadius(ctx: CanvasRenderingContext2D, position: tGridPosition) {

    const gameState = getGameState()

    const { selectedTurret, turrets, energy } = gameState;

    const gameGridPosition = getGameGridPosition(position.x, position.y);

    if (!gameGridPosition) {
        return;
    }

    const cellSize = CellSize(gameState);
    const drawRadius = (centerX : number, centerY: number, radius: number, fillStyle: string) => {
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
        ctx.fillStyle = fillStyle;
        ctx.fill();
    };

    const drawPlacementBox = (x: number, y: number, w: number, h: number, strokeStyle: string) => {
        ctx.strokeStyle = strokeStyle;
        ctx.strokeRect(x * cellSize, y * cellSize, w * cellSize, h * cellSize);
    };

    const { x: gx, y: gy } = gameGridPosition;

    if (isSpaceAvailable(gx, gy, selectedTurret.w, selectedTurret.h, getGameState())) {
        const radius = selectedTurret.range * cellSize;
        const centerX = gx * cellSize + selectedTurret.w * cellSize / 2;
        const centerY = gy * cellSize + selectedTurret.h * cellSize / 2;
        drawRadius(centerX, centerY, radius, energy < selectedTurret.cost ? 'rgba(255, 0, 0, 0.15)' : 'rgba(0, 255, 0, 0.15)');
        drawPlacementBox(gx, gy, selectedTurret.w, selectedTurret.h, selectedTurret.fillStyle);
    } else if (isGridSpaceTakenWithTurret(gx, gy, getGameState())) {

        const existingTurret = turrets.find(t => gx >= t.x && gx < t.x + t.w && gy >= t.y && gy < t.y + t.h);

        if (existingTurret) {
            drawRadius(existingTurret.cx * cellSize, existingTurret.cy * cellSize, existingTurret.range * cellSize, 'rgba(0,255,0,0.20)');
            // can turret be upgraded? if so draw upgradable radius
            if (existingTurret.level <= existingTurret.upgrades.length) {
                const upgradeRadius = existingTurret.upgrades[existingTurret.level - 1].range * cellSize;
                drawRadius(existingTurret.cx * cellSize, existingTurret.cy * cellSize, upgradeRadius, energy < existingTurret.upgrades[existingTurret.level - 1].cost ? 'rgba(255, 0, 0, 0.15)' : 'rgba(0, 255, 0, 0.15)');
            }
            drawPlacementBox(gx, gy, selectedTurret.w, selectedTurret.h, selectedTurret.fillStyle);
            gameState.hoveredTurret = existingTurret;
        } else {
            gameState.hoveredTurret = null
            console.error('This should not be possible')
        }
    } else {
        gameState.hoveredTurret = null
    }

}

