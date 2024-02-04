// Turret class
import Entity, {iEntityConstructorProps} from "./Entity";
import canvas from "./Canvas";
import CellSize from "./CellSize";
import {footerLevelBarHeight, iTurretInfo, OneThirdFooter, turretSectionHeight} from "./Footer";
import {getGameState} from "./Game";
import {elapsedTime} from "./Header";
import {tGameState} from "./InitialState";
import Monster from "./Monster";
import {getGameGridPosition, isSpaceAvailable} from "./Position";
import Projectile from "./Projectile";
import tGridPosition from "./tGridPosition";

export enum eTurretTargetType {
    OLDEST,
    NEWEST,
    CLOSEST,
}


export enum eTurretTargetDimensionsLocation {
    GAME,
    FOOTER
}

export enum eTurretTargetDimensionsType {

}

export type tTurretCallable = (location: eTurretTargetDimensionsLocation) => iTurretInfo;

export const Turret1: tTurretCallable = (location: eTurretTargetDimensionsLocation): iTurretInfo => {
    const forGame = location === eTurretTargetDimensionsLocation.GAME;
    return {
        x: 0,
        y: footerLevelBarHeight(),
        w: forGame ? 1 : canvas.width / 6,
        h: forGame ? 1 : turretSectionHeight(),
        fillStyle: 'rgba(0,0,0,1)',
        range: 10,
        damage: 50,
        cooldown: 9,
        cost: 50
    }
}

export const Turret2: tTurretCallable = (location: eTurretTargetDimensionsLocation): iTurretInfo => {
    const OneSixth = canvas.width / 6;
    const forGame = location === eTurretTargetDimensionsLocation.GAME;
    return {
        x: OneSixth,
        y: footerLevelBarHeight(),
        w: forGame ? 2 : OneSixth,
        h: forGame ? 2 : turretSectionHeight(),
        fillStyle: 'rgb(211,5,5)',
        range: 12,
        damage: 100,
        cooldown: 7,
        cost: 300
    }

}

export const Turret3: tTurretCallable = (location: eTurretTargetDimensionsLocation): iTurretInfo => {
    const OneSixth = canvas.width / 6;
    const forGame = location === eTurretTargetDimensionsLocation.GAME;
    return {
        x: OneSixth + OneSixth,
        y: footerLevelBarHeight(),
        w: forGame ? 3 : OneSixth,
        h: forGame ? 2 : turretSectionHeight(),
        fillStyle: 'rgb(192,172,39)',
        range: 15,
        damage: 200,
        cooldown: 8,
        cost: 1000
    }
}

export const Turret4: tTurretCallable = (location: eTurretTargetDimensionsLocation): iTurretInfo => {
    const OneSixth = canvas.width / 6;
    const forGame = location === eTurretTargetDimensionsLocation.GAME;
    return {
        x: OneSixth + 2 * OneSixth,
        y: footerLevelBarHeight(),
        w: forGame ? 3 : OneSixth,
        h: forGame ? 3 : turretSectionHeight(),
        fillStyle: 'rgb(157,156,156)',
        range: 17,
        damage: 1000,
        cooldown: 20,
        cost: 10000
    }
}

export const Turret5: tTurretCallable = (location: eTurretTargetDimensionsLocation): iTurretInfo => {
    const OneSixth = canvas.width / 6;
    const forGame = location === eTurretTargetDimensionsLocation.GAME;
    return {
        x: OneSixth + 3 * OneSixth,
        y: footerLevelBarHeight(),
        w: forGame ? 4 : OneSixth,
        h: forGame ? 4 : turretSectionHeight(),
        fillStyle: 'rgb(0,207,250)',
        range: 22,
        damage: 2000,
        cooldown: 3,
        cost: 40000
    }
}

export const Turret6: tTurretCallable = (location: eTurretTargetDimensionsLocation): iTurretInfo => {
    const OneSixth = canvas.width / 6;
    const forGame = location === eTurretTargetDimensionsLocation.GAME;
    return {
        x: OneSixth + 4 * OneSixth,
        y: footerLevelBarHeight(),
        w: forGame ? 5 : OneSixth,
        h: forGame ? 5 : turretSectionHeight(),
        fillStyle: 'rgb(232,122,54)',
        range: 30,
        damage: 10000,
        cooldown: 0,
        cost: 500000
    }
}

function calculateOpacity(time: number) {
    // Adjust the speed of the opacity change here. Higher values will make the opacity change faster.
    const speedFactor = 2 * Math.PI / 5; // Complete a cycle every 5 seconds

    // Calculate the time factor for the sine function
    const timeFactor = time * speedFactor;

    // Calculate opacity using the sine wave, adjusted to oscillate between 0 and 1
    return (Math.sin(timeFactor) + 1) / 2;
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

export class Turret extends Entity {
    centerX: number;
    centerY: number;
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
                }: iTurret & iEntityConstructorProps) {
        super({x, y, gameState});
        this.x = x;
        this.centerX = x + w / 2
        this.y = y;
        this.centerY = y + h / 2;
        this.w = w;
        this.h = h;

        // Dynamically update the grid based on the w and h
        for (let offsetY = 0; offsetY < h; offsetY++) {
            for (let offsetX = 0; offsetX < w; offsetX++) {
                const gridX = x + offsetX;
                const gridY = y + offsetY;

                // Check bounds to avoid accessing outside the grid
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

            let dx = this.centerX - monster.position.x;

            let dy = this.centerY - monster.position.y;

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
                x:this.centerX,
                y:this.centerY,
                target,
                speed:0.5,
                damage:this.damage
            }); // Speed and damage

            gameState.projectiles.push(projectile);

            // Reset cooldown
            this.timer = 0; // Cooldown period for 60 frames, for example
        }

    }

    move() : boolean {

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
        let baseX = this.centerX * cellSize - cellSize / 2;
        let baseY = this.centerY * cellSize - cellSize / 2;

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

        const timeDiff = elapsedTime(gameState, false);

        const opacity = calculateOpacity(timeDiff);

        // todo - make this opacity arc in and out
        ctx.fillStyle = `rgba(0,0,225, ${opacity})`;

        // Draw the ball on top
        let ballRadius = cellSize * 0.3; // Adjust size as needed
        ctx.beginPath();
        ctx.arc(baseX + baseWidth / 2, baseY, ballRadius, 0, 2 * Math.PI);
        ctx.fill();

        //ctx.drawImage(TurretImages.TurretOneImage, baseX, baseY, baseWidth * 2, baseHeight * 2);


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
    }
}
