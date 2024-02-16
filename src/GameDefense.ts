import MouseEvents from "MouseEvents";
import Alert from "./Alert";
import canvas from "./Canvas";
import {handleIEntity} from "./Entity";
import Footer from "./Footer";
import FPS from "./FPS";
import DrawGameGrid from "./Grid";
import Header, {elapsedTime} from "./Header";
import GameHeaderHeight from "./HeaderHeight";
import {eGameDisplayState, InitialGameState, tGameState} from "./InitialState";
import MainMenu from "./MainMenu";
import {createAndShowModal} from "./Modal";
import {scrollGridX, scrollGridY} from "./Scroll";
import showTurretRadius from "./showTurretRadius";
import Spawner from "./Spawner";
import Tutorial from "./Tutorial";
import {updateDimensions} from "./updateDimensions";

const context = canvas.getContext('2d')!;

// Game state
let gameState: tGameState = InitialGameState(context);

export function startNewGame() {
    gameState = InitialGameState(context);
    gameState.gameDisplayState = eGameDisplayState.GAME;
}

export function getGameState() {
    return gameState;
}

function gamePlay() {

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


// Game rendering function
// the oder of the rendering is important
// everything will be 'stacked' on top of each other
export default async function GameDefense() {

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
            gamePlay()
            return;
    }

}


canvas.addEventListener('wheel', function (event) {

    if (gameState.gameDisplayState !== eGameDisplayState.GAME) {
        return;
    }

    // Use event.deltaY for vertical mouse wheel event to scroll horizontally
    if (event.deltaX) {

        scrollGridX(event.deltaX); // Scroll right

    }

    if (event.deltaY) {

        scrollGridY(-event.deltaY)

    }

}, {passive: true});


document.addEventListener('keydown', function (event) {

    if (gameState.gameDisplayState !== eGameDisplayState.GAME) {
        return;
    }

    console.log('Keydown event', event.code, gameState);

    if (event.code === 'Space') {

        if (FPS() < 30) {

            console.warn('FPS is too low to continue');

            gameState.alerts.push(new Alert({
                message: 'Your FPS being < 30 is too low to continue',
                seconds: 5,
            }))

            return;

        }

        if (gameState.level === 100) {

            gameState.alerts.push(new Alert({
                message: 'You are on the final level! Finish this wave to see what your winning score is!',
                seconds: 5,
                fillStyle: 'rgb(172,39,192)',
                gameState
            }));

            return;
        }

        gameState.level++;

        gameState.alerts.push(new Alert({
            message: 'The space bar was pressed! Spawning wave (' + gameState.level + ') early!',
            seconds: 5,
            fillStyle: 'rgb(0, 255, 0)',
        }))

    }

}, {passive: true});

MouseEvents()


