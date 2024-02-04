import CellSize from "./CellSize";
import Alert from "./Alert";
import {iTurretInfo} from "./Footer";
import tGridPosition from "./tGridPosition";
import {eTurretTargetDimensionsLocation, Turret, Turret1} from "./Turret";
import Monster from "./Monster";
import Spawner from "./Spawner";
import Projectile from "./Projectile";
import Targets from "./Targets";
import {GameGrid2D} from "./Grid";
import Particle from "./Particle";

export type tGameState = {
    elapsedTime: number;
    elapsedTimeSeconds: number;
    context: CanvasRenderingContext2D;
    cellSize: number;
    alerts: Alert[];
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
    selectedTurret: iTurretInfo | null;
}

export const InitialGameState = (context: CanvasRenderingContext2D): tGameState => {

    const initialState: tGameState = {
        context: context,
        elapsedTime: 0,
        elapsedTimeSeconds: 0,
        cellSize: 0,
        alerts: [],
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
        mousePosition: {x: 0, y: 0},
        selectedTurret: Turret1(eTurretTargetDimensionsLocation.GAME)
    }

    initialState.cellSize = CellSize(initialState);

    return initialState;

};
