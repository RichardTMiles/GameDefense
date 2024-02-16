// Turret class
import updateColorToRGBA from "./updateColorToRGBA";
import Alert from "./Alert";
import tGridPosition from "./tGridPosition";
import Entity, {iEntityConstructorProps} from "./Entity";

import {elapsedTime} from "./Header";
import {tGameState} from "./InitialState";
import Monster from "./Monster";
import Projectile from "./Projectile";
import {eTurretTargetType} from "./Turrets";

function calculateOpacity(time: number, index: number) {

    // Adjust the speed of the opacity change here. Higher values will make the opacity change faster.
    const speedFactor = 2 * Math.PI / 5; // Complete a cycle every 5 seconds

    // Calculate the time factor for the sine function
    const timeFactor = time * speedFactor;

    // Calculate opacity using the sine wave, adjusted to oscillate between 0 and 1
    return (Math.sin(timeFactor + index) + 1) / 2;

}

interface iTurretUpgrade {
    cost: number;
    range: number;
    damage: number;
    cooldown: number;
    speed: number;
}


export interface iTurret {
    level?: number;
    x: number;
    y: number;
    w: number;
    h: number;
    cost: number;
    speed: number;
    range: number;
    damage: number;
    fillStyle: string;
    cooldown?: number;
    direction?: tGridPosition;
    targetType?: eTurretTargetType;
    upgrades: iTurretUpgrade[];
}

export class Turret extends Entity implements iTurret {
    x: number;
    y: number;
    w: number;
    h: number;
    cx: number;
    cy: number;
    cost: number;
    speed: number;
    range: number;
    damage: number;
    fillStyle: string;
    cooldown?: number;
    upgrades: iTurretUpgrade[];
    level: number = 1;
    targetType: eTurretTargetType;
    private timer: number = 0;
    private key: number = 0;

    constructor({
                    x,
                    y,
                    gameState,
                    ...turretInfo
                }: iTurret & iEntityConstructorProps) {
        super({x, y, gameState});
        this.x = x;
        this.y = y;
        this.cx = x + turretInfo.w / 2;
        this.cy = y + turretInfo.h / 2;
        this.w = turretInfo.w;
        this.h = turretInfo.h;
        this.targetType = eTurretTargetType.CLOSEST;
        this.cooldown = turretInfo.cooldown
        this.fillStyle = turretInfo.fillStyle;
        this.range = turretInfo.range;
        this.damage = turretInfo.damage;
        this.speed = turretInfo.speed;
        this.upgrades = turretInfo.upgrades;
        this.cost = turretInfo.cost;
        this.key = gameState.turrets.length;


        // update the grid based on the w and h to indicate a turret is placed and space is taken
        for (let offsetY = 0; offsetY < this.h; offsetY++) {
            for (let offsetX = 0; offsetX < this.w; offsetX++) {
                const gridX = x + offsetX;
                const gridY = y + offsetY;

                // Check bounds to avoid accessing outside the grid
                if (gridY >= 0 && gridY < gameState.gameGrid.length && gridX >= 0 && gridX < gameState.gameGrid[gridY].length) {
                    gameState.gameGrid[gridY][gridX] = 3; // Update the grid to indicate a turret is placed
                }
            }
        }

    }

    switchXY() {
        super.switchXY()
        this.cx = this.x + this.w / 2;
        this.cy = this.y + this.h / 2;
    }


    upgrade() {


        if (this.level > this.upgrades.length) {

            console.log('Turret is already at max level', this);

            return;

        }

        const upgrade = this.upgrades[this.level - 1];

        if (this.gameState.energy < this.upgrades[this.level - 1].cost) {

            // add new alert
            this.gameState.alerts.push(new Alert({
                message: "Not enough energy to upgrade turret",
                seconds: 4
            }))

            return;

        }

        this.range = upgrade.range;
        this.damage = upgrade.damage;
        this.cooldown = upgrade.cooldown;
        this.speed = upgrade.speed;
        this.level++;
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

            let dx = this.cx - monster.position.x;

            let dy = this.cy - monster.position.y;

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

            const projectile = new Projectile({
                startX: 0,
                startY: 0,
                x: this.cx,
                y: this.cy,
                target,
                speed: this.speed,
                damage: this.damage
            }); // Speed and damage

            gameState.projectiles.push(projectile);

            // Reset cooldown
            this.timer = 0; // Cooldown period for 60 frames, for example

        }

    }

    move(): boolean {

        const gameState = this.gameState;

        if (this.cooldown > this.timer) {

            this.timer++;

        }

        let target = this.findTarget(gameState.monsters);

        if (target) {

            this.shoot(target, gameState);

        }

        return true;

    }

    draw() {

        const ctx = this.gameState.context;

        const gameState = this.gameState
        const cellSize = gameState.cellSize;

        // Base position and dimensions
        let baseX = this.cx * cellSize - cellSize / 2;
        let baseY = this.cy * cellSize - cellSize / 2;

        let baseWidth = cellSize;
        let baseHeight = cellSize * 0.6; // Making the base a bit shorter than a full cell

        ctx.fillStyle = this.fillStyle;         // Turret color


        // Draw the cylindrical base
        ctx.beginPath();
        ctx.ellipse(baseX + baseWidth / 2, baseY + baseHeight, baseWidth / 2, baseHeight / 2, 0, 0, 2 * Math.PI);
        ctx.fill();


        // Draw the rectangular part of the base
        ctx.fillStyle = this.fillStyle;         // Turret color

        ctx.fillRect(baseX, baseY, baseWidth, baseHeight);


        //ctx.drawImage(TurretImages.TurretOneImage, baseX, baseY, baseWidth * 2, baseHeight * 2);

    }

    showLevelColor() {
        const ctx = this.gameState.context;

        const gameState = this.gameState
        const cellSize = gameState.cellSize;
        const baseWidth = cellSize;

        // Base position and dimensions
        const baseX = this.cx * cellSize - cellSize / 2;
        const baseY = this.cy * cellSize - cellSize / 2;


        const timeDiff = elapsedTime(this.gameState, false);

        // make opacity arc in and out
        // if level is max make opacity 1
        const opacity = this.level > this.upgrades.length ? 1 : calculateOpacity(timeDiff, this.key);

        // todo - make this opacity arc in and out
        ctx.fillStyle = updateColorToRGBA((() => {
            switch (this.level) {
                case 1:
                    return 'rgba(0,0,225)'
                case 2:
                    return 'rgb(64,225,0)'
                case 3:
                    return 'rgb(199,19,19)'
                case 4:
                    return 'rgb(255,255,255)'
                default:
                    return 'rgb(170,0,96)'
            }
        })(), opacity);

        // Draw the ball on top - this color should change to signal what power level the turret is on
        let ballRadius = cellSize * 0.3; // Adjust size as needed
        ctx.beginPath();
        ctx.arc(baseX + baseWidth / 2, baseY, ballRadius, 0, 2 * Math.PI);
        ctx.fill();

    }

}


