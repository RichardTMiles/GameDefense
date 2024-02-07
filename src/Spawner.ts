import {tGameState} from "./InitialState";
import Monster from "./Monster";


interface iSpawner {
    interval: number;
    amount: number;
    health: number;
    speed: number;
}

export default class Spawner {
    private interval: number;
    private counter: number;
    private amount: number;
    private health: number;
    private speed: number;

    constructor({interval, amount, health, speed }: iSpawner) {

        this.interval = interval; // The interval in frames between spawns

        this.counter = 0; // A counter to track when to spawn next

        this.amount = amount; // The number of monsters to spawn

        this.health = health; // The health of the monsters to spawn

        this.speed = speed; // The speed of the monsters to spawn

    }

    update(gameState: tGameState) {

        if (this.amount === 0) {

            return false;

        }

        if (this.counter >= this.interval) {

            this.counter = 0; // Reset the counter

            this.amount--; // Reduce the amount of monsters left to spawn

            // Spawn a new monster
            const spawnLocation = gameState.spawnLocations[Math.floor(Math.random() * gameState.spawnLocations.length)];

            if (!spawnLocation) {
                console.error("No spawn location found", gameState.spawnLocations);
                return false;
            }

            gameState.monsters.push(new Monster({
                health: this.health,
                x: spawnLocation.x,
                y: spawnLocation.y,
                speed: this.speed,
                gameState
            }));

        } else {

            this.counter++;

        }

        return true;

    }

}