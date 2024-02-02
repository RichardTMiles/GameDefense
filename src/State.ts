import tGridPosition from "./tGridPosition";
import {Turret} from "./Turret";
import Monster, {Spawner} from "./Monster";
import Projectile from "./Projectile";
import Targets from "./Targets";
import {GameGrid2D} from "./Grid";
import Particle from "./Particle";

export type tGameState = {
    level: number;
    processedLevel: number;
    monsters: Monster[];
    spawners: Spawner[];
    projectiles: Projectile[];
    particles: Particle[];
    turrets: Turret[];
    gameTargets: (tGridPosition & { destroyed: boolean })[];
    score: number;
    offsetX: number;
    offsetY: number;
    startTime: number;
    gameGrid: number[][];
    energy: number;
    status: string;
    mousePosition: tGridPosition;
}

const GameState: tGameState = {
    particles: [], // This will hold particle objects
    gameGrid: GameGrid2D,
    gameTargets: Targets,
    offsetX: 0, // This will be used to scroll the grid horizontally
    offsetY: 0, // This will be used to scroll the grid vertically
    level: 1,
    processedLevel: 0,
    startTime: (new Date()).getTime(),
    energy: 0,
    score: 0,
    turrets: [], // This will hold turret objects
    monsters: [], // This will hold monster objects
    projectiles: [], // This will hold projectile objects
    spawners: [], // This will hold spawner objects to systematically spawn monsters
    status: 'playing', // playing, won, or lost,
    mousePosition: {x: 0, y: 0}
};


export default GameState;