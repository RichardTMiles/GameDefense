import iEntity from "./interfaces/iEntity";
import monsterImage from "./assets/svg/MonsterSVG";
import GameHeaderHeight from "./HeaderHeight";
import {energyCirclePosition, scoreCirclePosition} from "./Header";
import Particle from "./Particle";
import {tGameState} from "./InitialState";
import tGridPosition from "./tGridPosition";
import {dijkstraWithCaching} from "./Dijkstra";


export interface iMonster {
    x: number,
    y: number,
    gameState: tGameState,
    speed?: number,
    health?: number,
}

export default class Monster implements iEntity {
    path: tGridPosition[];
    pathIndex: number;
    position: tGridPosition;
    speed: number;
    health: number;
    startingHealth: number;
    damageDoneAndQueued: number;
    isDestroyed = false;
    private cellSize = 0;

    constructor({x, y, gameState, speed = 0.2, health = 100}: iMonster) {
        this.path = dijkstraWithCaching(gameState.gameGrid, {
            x: x,
            y: y
        }, gameState.gameTargets.find(orb => orb.destroyed === false));
        this.pathIndex = 0; // Start at the first point of the path
        this.position = {x: x, y: y}; // Current position of the monster
        this.speed = speed; // Speed of the monster, adjust as needed
        this.health = health; // Health of the monster, adjust as needed
        this.startingHealth = health;
        this.damageDoneAndQueued = 0;
    }

    draw(ctx: CanvasRenderingContext2D) {
        // Draw the monster using the blue 3D diamond SVG image
        ctx.drawImage(monsterImage, this.position.x * this.cellSize, this.position.y * this.cellSize, this.cellSize, this.cellSize);

    }

    move(gameState: tGameState): boolean {

        const cellSize: number = gameState.cellSize;

        this.cellSize = cellSize;

        if (this.health <= 0) {

            this.isDestroyed = true;

            const headerSize = GameHeaderHeight()

            const start = {
                x: cellSize * this.position.x + headerSize,
                y: cellSize * this.position.y + headerSize
            };

            const energy = energyCirclePosition();

            gameState.particles.push(new Particle({
                fillStyle: 'rgb(39,192,42)',
                start: {
                    x: cellSize * this.position.x + headerSize,
                    y: cellSize * this.position.y + headerSize
                },
                control: gameState.particles.length % 2 ? {
                    x: start.x,
                    y: energy.y
                } : {
                    x: energy.x,
                    y: start.y
                },
                end: energy,
                callback: () => {
                    gameState.energy += 10 * gameState.level + this.startingHealth;
                }
            }));

            const score = scoreCirclePosition();
            gameState.particles.push(new Particle({
                fillStyle: 'rgb(172,39,192)',
                start: {
                    x: cellSize * this.position.x + headerSize,
                    y: cellSize * this.position.y + headerSize
                },
                control: gameState.particles.length % 2 ? {
                    x: start.x,
                    y: score.y
                } : {
                    x: score.x,
                    y: start.y
                },
                end: score,
                callback: () => {
                    gameState.score += 10 * gameState.level + this.startingHealth;
                }
            }));

            return false;

        }

        const finalPath = this.path[this.path.length - 1];

        if (undefined === finalPath) {

            return false;

        }

        // check if the destination orb is still there
        const destinationOrb = gameState.gameTargets.find(orb => {
            return false === orb.destroyed && orb.x === finalPath.x && orb.y === finalPath.y
        });

        // If the monster has reached the end of the path, stop moving
        if (undefined === destinationOrb || this.pathIndex === this.path.length - 1) {

            console.log(destinationOrb, this.pathIndex, this.path.length, this.path);

            const finalPath = this.path[this.path.length - 1];

            // remove the orbs from the game grid that match this.pathIndex
            gameState.gameTargets = gameState.gameTargets.map(orb => {
                if (orb.x === finalPath.x && orb.y === finalPath.y) {
                    orb.destroyed = true;
                }
                return orb;
            });

            if (0 === gameState.gameTargets.length) {

                console.log('game over', gameState.gameTargets);

                gameState.status = 'lost';

                return false;

            }

            this.pathIndex = 0;

            this.path = dijkstraWithCaching(gameState.gameGrid, this.position, gameState.gameTargets.find(orb => orb.destroyed === false));

            return true;
        }

        // Get the next point on the path
        const target = this.path[this.pathIndex + 1];

        // Calculate the direction vector from current position to the target
        const dir = {
            x: target.x - this.position.x,
            y: target.y - this.position.y
        };

        // Normalize the direction
        const length = Math.sqrt(dir.x * dir.x + dir.y * dir.y);
        dir.x /= length;
        dir.y /= length;

        // Move the monster towards the target
        this.position.x += dir.x * this.speed;
        this.position.y += dir.y * this.speed;

        // Check if the monster has reached the target point
        if (Math.hypot(this.position.x - target.x, this.position.y - target.y) < this.speed) {
            this.position = {...target}; // Snap to the target to avoid overshooting
            this.pathIndex++; // Move to the next point
        }

        return true;

    }

}
