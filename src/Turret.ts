// Turret class
import {tGameState} from "./State";
import Projectile from "./Projectile";
import Monster from "./Monster";

export class Turret {
    x: number;
    y: number;
    range: number;
    damage: number;
    cooldown: number;
    timer: number;
    constructor(x: number, y: number, range: number = 5, damage: number, cooldown: number = 10) {
        this.x = x;
        this.y = y;
        this.range = range;
        this.damage = damage;
        this.cooldown = cooldown;
        this.timer = 0;
    }

    findTarget(monsters : Monster[]) {

        // Find the closest monster within range
        let target = null;

        let minDist = this.range;

        for (let monster of monsters) {

            let dx = this.x - monster.position.x;

            let dy = this.y - monster.position.y;

            let dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < minDist) {

                target = monster;

                minDist = dist;

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
        ctx.fillStyle = 'rgba(172,39,192,0.66)';

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