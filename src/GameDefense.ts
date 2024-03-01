import State from "./State.ts";
import KeyEvents from "./KeyEvents.ts";
import MouseEvents from "./MouseEvents";
import Alert from "./Alert";
import {handleIEntity} from "./Entity";
import Footer from "./Footer";
import DrawGameGrid from "./Grid";
import Header, {elapsedTime} from "./Header";
import GameHeaderHeight from "./HeaderHeight";
import {eGameDisplayState, InitialGameState} from "./InitialState";
import MainMenu, {mainMenuEventListeners} from "./MainMenu";
import {createAndShowModal} from "./Modal";
import showTurretRadius from "./showTurretRadius";
import Spawner from "./Spawner";
import Tutorial from "./Tutorial";
import {updateDimensions} from "./updateDimensions";


const GameDefense = class {

    constructor(canvas ?: HTMLCanvasElement) {

        let isReactNative = false;

        if (typeof document !== 'undefined') {

            console.log('Canvas.ts document is defined')

            State.canvas = document.createElement('canvas');

            document.body.appendChild(State.canvas);

        } else if (undefined !== canvas) {

            console.log('Canvas.ts document is undefined (React Native)', typeof canvas)

            State.canvas = canvas;

            isReactNative = true;

        } else {

            console.error('Unknown state')

            return;

        }

        if (undefined === State.canvas || State.canvas === null) {

            console.error('Canvas.ts canvas failed to initialize')

            return;

        }

        State.context = State.canvas.getContext('2d')!;

        State.gameState = InitialGameState(State.context);

        State.gameState.isReactNative = isReactNative;

        if (false === isReactNative) {

            MouseEvents()

            KeyEvents()

            mainMenuEventListeners()

        }

        let fpsInterval = 1000 / 35; // 35 FPS

        let then = 0;

        const gameLoop = async (now: number) => {

            then = then || now;

            let elapsed = now - then;

            if (elapsed > fpsInterval) {

                then = now - (elapsed % fpsInterval);

                try {

                    await this.GameDefense();

                } catch (e) {

                    console.error(e);

                    return;

                }

            }

            requestAnimationFrame(gameLoop);

        }

        requestAnimationFrame(gameLoop);

    }


    // Game rendering function
    // the oder of the rendering is important
    // everything will be 'stacked' on top of each other
    private async GameDefense() {

        const gameState = State.gameState;

        updateDimensions(gameState);

        // this will update the game state with the current and elapsed time
        switch (gameState.gameDisplayState) {
            default:
                console.error('Unknown game display state', gameState.gameDisplayState);
                return;
            case eGameDisplayState.PAUSED:
                console.log('Game is paused');
                while (gameState.gameDisplayState === eGameDisplayState.PAUSED) {
                    await new Promise(resolve => setTimeout(resolve, 1000));
                }
                return;
            case eGameDisplayState.MAIN_MENU:
                MainMenu(gameState);
                return;
            case eGameDisplayState.GAME_OVER:
                console.log('Game over');
                createAndShowModal('Game Over! You ' + gameState.status + '!', gameState);
                while (gameState.gameDisplayState === eGameDisplayState.GAME_OVER) {
                    await new Promise(resolve => setTimeout(resolve, 1000));
                }
                return;
            case eGameDisplayState.GAME:
                this.gamePlay()
                return;
        }

    }


    private gamePlay() {

        const gameState = State.gameState;

        const canvas = State.canvas;

        const context = State.context;

        gameState.ticks++;

        // Clear the entire canvas
        context.clearRect(0, 0, canvas.width, canvas.height);

        // Save the current context state (with no translations)
        context.save();

        elapsedTime(gameState, false);

        // controls alert ordering for tutorial
        Tutorial(gameState);

        // move the grid context to the "Game Grid" position
        context.save();

        // Translate the (x,y) context for horizontal scrolling of the game grid. We will handle scrolling in the game not
        // the browser. Don't ask me why x is negative??
        context.translate(-gameState.offsetX, gameState.offsetY + GameHeaderHeight());//headerHeight

        // game grid
        DrawGameGrid(context, gameState);

        // draw game objectives, the monsters will be targeting these locations with a pathfinding algorithm
        gameState.gameTargets.forEach(turret => handleIEntity(turret));

        // if any levels have been passed, add more spawners
        if (gameState.processedLevel < gameState.level) {

            gameState.processedLevel++;

            gameState.spawners.push(new Spawner(
                0 === gameState.level % 10
                    ? {
                        interval: 0,
                        amount: Math.min(gameState.level / 2, 10),
                        speed: .01 * (gameState.level / 10),
                        health: 1000 * gameState.level,
                    }
                    : {
                        interval: 100 / gameState.level,
                        amount: gameState.level * 5,
                        speed: .2 + gameState.level * .0002,
                        health: 100 * gameState.level * (gameState.level / 2),
                    }
            ));

        }

        // spawners are passive and do not get drawn, they only effect the state of the game by adding monsters
        gameState.spawners = gameState.spawners.filter(spawner => spawner.update(gameState));

        // Update turrets and draw them; turrets don't get removed (filtered) from the game state
        gameState.turrets.forEach(turret => handleIEntity(turret));

        // I seperated this so the bodies of the turrets are drawn first and can not override the turret level dot
        gameState.turrets.forEach(turret => turret.showLevelColor());

        // filter projectiles from game state - remove any destroyed projectiles so were not running this loop often
        gameState.projectiles = gameState.projectiles.filter(projectile => handleIEntity(projectile)) ?? [];

        // filter monsters from game state - remove any destroyed monsters so were not running this loop often
        gameState.monsters = gameState.monsters.filter(monster => handleIEntity(monster)) ?? [];

        // filter alerts from game state - remove any destroyed alerts so were not running this loop often
        gameState.alerts = gameState.alerts.filter(alert => handleIEntity(alert))

        // The current mouse location may or may not show the turret radius, depending on the mouse position
        showTurretRadius(context, gameState.mousePosition);

        // Restore the context to the state before we translated it (x,y) for the game grid
        context.restore();
        // \END GAME GRID

        // draw header
        Header(context, gameState);

        // draw footer
        Footer(context, gameState)

        // particle effects are drawn using a Bézier curve and a random control point
        gameState.particles = gameState.particles.filter(particle => handleIEntity(particle));

        if (0 === gameState.gameTargets.length) {

            gameState.gameDisplayState = eGameDisplayState.GAME_OVER;

        }

        // add a level advancement and winning condition
        // Movable objects should be completed and removed from the game state before we advance the level
        // It is tempting to add gameState.alerts.length to the list, but I don't want a hidden way to pause the game
        if (0 === gameState.monsters.length
            && 0 === gameState.spawners.length
            && 0 === gameState.particles.length
            && 0 === gameState.projectiles.length) {

            if (100 === gameState.level) {

                gameState.alerts.push(new Alert({
                    message: 'WINNER! You have completed 100 levels! Leaderboards coming soon :) How far can you go?',
                    seconds: 10,
                    gameState
                }));

                console.log(gameState)

            }

            gameState.level++;

        }


    }


}

export default GameDefense;

