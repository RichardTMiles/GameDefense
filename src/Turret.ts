// Turret class
import {getGameGridPosition, isSpaceAvailable} from "./Position";
import CellSize from "./CellSize";
import {getGameState} from "./Game";
import tGridPosition from "./tGridPosition";
import {tGameState} from "./InitialState";
import Projectile from "./Projectile";
import Monster from "./Monster";

export enum eTurretTargetType {
    OLDEST,
    NEWEST,
    CLOSEST,
}

export interface iTurret {
    x: number;
    y: number;
    w: number;
    h: number;
    cost: number;
    range: number;
    damage: number;
    fillStyle: string;
    cooldown?: number;
    direction?: tGridPosition;
    targetType?: eTurretTargetType;
}

export class Turret {
    x: number;
    y: number;
    w: number;
    h: number;
    range: number;
    damage: number;
    cooldown: number;
    fillStyle: string;
    cost: number;
    private timer: number;
    targetType: eTurretTargetType;

    constructor({
                    x,
                    y,
                    fillStyle,
                    range,
                    cost,
                    damage,
                    cooldown = 10,
                    w,
                    h,
                    gameState,
                    targetType = eTurretTargetType.OLDEST
                }: iTurret & { gameState: tGameState }) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;

        // Dynamically update the grid based on the w and h
        for (let offsetY = 0; offsetY < h; offsetY++) {
            for (let offsetX = 0; offsetX < w; offsetX++) {
                const gridX = x + offsetX;
                const gridY = y + offsetY;

                // Check bounds to avoid accessing outside of the grid
                if (gridY >= 0 && gridY < gameState.gameGrid.length && gridX >= 0 && gridX < gameState.gameGrid[gridY].length) {
                    gameState.gameGrid[gridY][gridX] = 3; // Update the grid to indicate a turret is placed
                }
            }
        }

        this.range = range; // radius
        this.damage = damage;
        this.cooldown = cooldown;
        this.cost = cost;
        this.fillStyle = fillStyle;
        this.targetType = targetType; // Default direction
        this.timer = 0;
    }


    normalize(vector: { x: number; y: number }) {
        const magnitude = Math.sqrt(vector.x * vector.x + vector.y * vector.y);
        return {
            x: vector.x / magnitude,
            y: vector.y / magnitude
        };
    }


    findTarget(monsters: Monster[]) {

        // Find the closest monster within range
        let target = null;

        let minDist = this.range;

        if (this.targetType === eTurretTargetType.NEWEST) {

            monsters = monsters.reverse()

        }

        for (let monster of monsters) {

            if (monster.startingHealth - monster.damageDoneAndQueued <= 0) {

                continue;

            }

            let dx = this.x - monster.position.x;

            let dy = this.y - monster.position.y;

            let dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < minDist) {

                target = monster;

                switch (this.targetType) {
                    case eTurretTargetType.CLOSEST:
                        minDist = dist;
                        break;
                    default:
                    case eTurretTargetType.NEWEST:
                    case eTurretTargetType.OLDEST:
                        return target;
                }

            }

        }

        return target;

    }

    shoot(target: Monster, gameState: tGameState) {

        if (this.timer >= this.cooldown) {

            const projectile = new Projectile(this.x, this.y, target, 0.5, this.damage); // Speed and damage

            gameState.projectiles.push(projectile);

            // Reset cooldown
            this.timer = 0; // Cooldown period for 60 frames, for example
        }

    }

    update(monsters: Monster[], gameState: tGameState) {

        if (this.cooldown > this.timer) {

            this.timer++;

        }

        let target = this.findTarget(monsters);

        if (target) {

            this.shoot(target, gameState);

        }

    }

    draw(ctx: CanvasRenderingContext2D, cellSize: number) {

        // Base position and dimensions
        let baseX = this.x * cellSize;
        let baseY = this.y * cellSize;
        let baseWidth = cellSize;
        let baseHeight = cellSize * 0.6; // Making the base a bit shorter than a full cell

        // Turret color
        ctx.fillStyle = this.fillStyle;

        // Draw the cylindrical base
        ctx.beginPath();
        ctx.ellipse(baseX + baseWidth / 2, baseY + baseHeight, baseWidth / 2, baseHeight / 2, 0, 0, 2 * Math.PI);
        ctx.fill();

        // Draw the rectangular part of the base
        ctx.fillRect(baseX, baseY, baseWidth, baseHeight);

        // Draw the ball on top
        let ballRadius = cellSize * 0.3; // Adjust size as needed
        ctx.beginPath();
        ctx.arc(baseX + baseWidth / 2, baseY, ballRadius, 0, 2 * Math.PI);
        ctx.fill();
    }

}

export function showTurretRadius(ctx: CanvasRenderingContext2D, position: tGridPosition) {
    const gameState = getGameState();

    const mouseX = position.x;
    const mouseY = position.y;
    const gameGridPosition = getGameGridPosition(mouseX, mouseY);

    if (undefined === gameGridPosition) {
        return;
    }

    const { x, y } = gameGridPosition;
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
        ctx.strokeStyle = 'red'; // Red border for the placement box
        ctx.strokeRect(x * cellSize, y * cellSize, turret.w * cellSize, turret.h * cellSize);
    }
}
