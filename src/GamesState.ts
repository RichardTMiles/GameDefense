import Monster, {Spawner} from "./GameMonster";
import Projectile from "./GameProjectile";
import GameTargets from "./GameTargets";
import GameGrid from "./GameGrid";

export type tGameState = {
    level: number;
    processedLevel: number;
    monsters: Monster[];
    spawners: Spawner[];
    projectiles: Projectile[];
    score: number;
    rotationX: number;
    rotationY: number;
    offsetX: number;
    offsetY: number;
    turrets: any[];
    startTime: number;
    gameGrid: number[][];
    gameTargets: any[];
    energy: number;
    status: string
}

const GameState: tGameState = {
    gameGrid: GameGrid,
    gameTargets: GameTargets,
    offsetX: 0, // This will be used to scroll the grid horizontally
    offsetY: 0, // This will be used to scroll the grid horizontally
    level: 1,
    processedLevel: 0,
    startTime: (new Date()).getTime(),
    energy: 0,
    score: 0,
    turrets: [], // This will hold turret objects with x, y, and type properties,
    monsters: [], // This will hold monster objects with x, y, and type properties,
    projectiles: [], // This will hold projectile objects with x, y, and type properties,
    spawners: [], // This will hold spawner objects to systematically spawn monsters
    status: 'playing', // playing, won, or lost,
    rotationX: 0,
    rotationY: 0,
};


export default GameState;