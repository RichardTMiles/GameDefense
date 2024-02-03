import {tGameState} from "./InitialState";
import Monster from "./Monster";


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

export default class Spawner {
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

            gameState.monsters.push(new Monster({
                health: 10 * gameState.level * (gameState.level / 2),
                x: spawnLocation.x,
                y: spawnLocation.y,
                gameState
            }));

        } else {

            this.counter++;

        }

        return true;

    }

}