// Turret class
import HeaderHeight from "./HeaderHeight";
import {getGameGridPosition, isSpaceAvailable} from "./Position";
import CellSize from "./CellSize";
import {getGameState} from "./Game";
import tGridPosition from "./tGridPosition";
import {tGameState} from "./InitialState";
import Projectile from "./Projectile";
import Monster from "./Monster";

export interface iTurret {
    x: number;
    y: number;
    cost: number;
    range: number;
    damage: number;
    fillStyle: string;
    cooldown?: number;
    direction?: tGridPosition;
}

export enum eTurretTargetType {
    OLDEST,
    NEWEST,
    CLOSEST,
}

export class Turret {
    x: number;
    y: number;
    range: number;
    damage: number;
    cooldown: number;
    fillStyle: string;
    cost: number;
    direction: tGridPosition; // Directional vector
    private timer: number;
    targetType: eTurretTargetType = eTurretTargetType.OLDEST;

    constructor({x, y, fillStyle, range, cost, damage, cooldown = 10, direction = {x: 1, y: 0}}: iTurret) {
        this.x = x;
        this.y = y;
        this.range = range; // radius
        this.damage = damage;
        this.cooldown = cooldown;
        this.cost = cost;
        this.fillStyle = fillStyle;
        this.direction = direction; // Default direction
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

    const gameState = getGameState()

    const mouseX = position.x;

    const mouseY = position.y;

    const gameGridPosition = getGameGridPosition(mouseX, mouseY);

    if (undefined === gameGridPosition) {

        return;

    }

    const {x, y} = gameGridPosition;

    const cellSize = CellSize(gameState);

    if (isSpaceAvailable(x, y)) {

        const turretRadius = gameState.selectedTurret.range * cellSize; // Example radius, adjust according to your game's logic

        const centerX = (x * cellSize) + (cellSize / 2);

        const centerY = (y * cellSize) + (cellSize / 2);

        // Draw the turret radius
        ctx.beginPath();

        ctx.arc(centerX, centerY, turretRadius, 0, 2 * Math.PI, false);

        const fillStyle = gameState.selectedTurret.fillStyle;

        ctx.fillStyle = fillStyle.includes('rgb(')
            ? fillStyle
                .replace(/rgb/i, "rgba")
                .replace(/\)/i, ',0.15)')
            : fillStyle; // Semi-transparent fill

        ctx.fill();

        ctx.strokeStyle = 'red'; // Red border

        ctx.stroke();

    }

}


