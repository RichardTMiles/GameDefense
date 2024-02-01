import {tGameState} from "./GamesState";
import tGridPosition from "./tGridPosition";
import {dijkstraWithCaching} from "./Dijkstra";

// Monster class
import gameGrid from "./GameGrid";


const spawnLocations = [
    {x: 1, y: 1},
    {x: 1, y: 10},
    {x: 1, y: 11},
    {x: 1, y: 12},
    {x: 1, y: 24},
    {x: 1, y: 25},
    {x: 1, y: 34},
    {x: 1, y: 35},
]

export class Spawner {
    private interval: number;
    private counter: number;
    private amount: number;

    constructor(interval: number, amount: number) {

        this.interval = interval; // The interval in frames between spawns

        this.counter = 0; // A counter to track when to spawn next

        this.amount = amount; // The number of monsters to spawn

    }

    update(gameState: tGameState) {

        if (this.amount === 0) {

            return false;

        }

        if (this.counter >= this.interval) {

            this.counter = 0; // Reset the counter

            this.amount--; // Reduce the amount of monsters left to spawn

            // Spawn a new monster
            const spawnLocation = spawnLocations[Math.floor(Math.random() * spawnLocations.length)];

            gameState.monsters.push(new Monster(spawnLocation.x, spawnLocation.y, gameState));

        } else {

            this.counter++;

        }

        return true;

    }

}

export default class Monster {
    path: tGridPosition[];
    pathIndex: number;
    position: tGridPosition;
    speed: number;
    health: number;
    constructor(x: number, y:number, gameState: tGameState, speed = 0.2, health = 100, ) {
        this.path = dijkstraWithCaching(gameGrid, {x: x, y: y}, gameState.gameTargets[0]);
        this.pathIndex = 0; // Start at the first point of the path
        this.position = {x: x, y: y}; // Current position of the monster
        this.speed = speed; // Speed of the monster, adjust as needed
        this.health = health; // Health of the monster, adjust as needed
    }

    move(gameState: tGameState) {

        const finalPath = this.path[this.path.length - 1];

        // check if the destination orb is still there
        const destinationOrb = gameState.gameTargets.find(orb =>
            orb.x === finalPath.x && orb.y === finalPath.y);


        console.log('destinationOrb', destinationOrb);

        // If the monster has reached the end of the path, stop moving
        if (undefined === destinationOrb || this.pathIndex === this.path.length - 1) {

            console.log(destinationOrb, this.pathIndex, this.path.length, this.path);

            const finalPath = this.path[this.path.length - 1];

            // remove the orbs from the game grid that match this.pathIndex
            gameState.gameTargets = gameState.gameTargets.filter(orb => !(orb.x === finalPath.x && orb.y === finalPath.y));

            console.log('gameTargets', gameState.gameTargets);

            if (0 === gameState.gameTargets.length) {

                console.log('game over', gameState.gameTargets);

                gameState.status = 'lost';

                return;

            }

            this.pathIndex = 0;

            this.path = dijkstraWithCaching(gameGrid, this.position, gameState.gameTargets[0]);

            console.log('new path', this.path);

            return;
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
    }
}
