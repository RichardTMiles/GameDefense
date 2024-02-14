import Tutorial from "./Tutorial";
import showTurretRadius from "./showTurretRadius";
import Entity from "./Entity";
import {updateDimensions} from "./updateDimensions";
import {scrollGridX, scrollGridY} from "./Scroll";
import Alert from "./Alert";
import canvas from "./Canvas";
import Footer, {GameFooterHeight, handleFooterClick} from "./Footer";
import FPS from "./FPS";
import DrawGameGrid from "./Grid";
import Header, {elapsedTime} from "./Header";
import GameHeaderHeight from "./HeaderHeight";
import {InitialGameState, tGameState} from "./InitialState";
import {createAndShowModal} from "./Modal";
import {getGameGridPosition, isSpaceAvailable} from "./Position";
import Spawner from "./Spawner";
import {DrawGameTargets} from "./Targets";
import {Turret} from "./Turret";

const context = canvas.getContext('2d')!;

// Game state
let gameState: tGameState = InitialGameState(context)

export function getGameState() {
    return gameState;
}

function handleIEntity(entity: Entity): boolean {

    if (!entity.move()) { // If the projectile is destroyed, it will be removed by the filter next iteration of game loop

        return false;

    }

    entity.draw();

    return true;
}


// Game rendering function
// the oder of the rendering is important
// everything will be 'stacked' on top of each other
export default function Game() {

    // Clear the entire canvas
    context.clearRect(0, 0, canvas.width, canvas.height);

    // Save the current context state (with no translations)
    context.save();

    updateDimensions(gameState);

    // this will update the game state with the current and elapsed time
    elapsedTime(gameState, false);

    Tutorial(gameState);

    // move the grid context to the "Game Grid" position
    context.save();

    // Translate the (x,y) context for horizontal scrolling of the game grid. We will handle scrolling in the game not
    // the browser. Don't ask me why x is negative??
    context.translate(-gameState.offsetX, gameState.offsetY + GameHeaderHeight());//headerHeight

    // game grid
    DrawGameGrid(context, gameState);

    // draw game objectives, the monsters will be targeting these locations with a pathfinding algorithm
    DrawGameTargets(gameState);

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
    gameState.turrets.forEach(turret => handleIEntity(turret))

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

    // add a level advancement and winning condition
    if (0 === gameState.monsters.length
        && 0 === gameState.spawners.length) {

        if (100 === gameState.level) {

            gameState.alerts.push(new Alert({
                message: 'WINNER! You have completed 100 levels! How far can you go?',
                seconds: 10,
                gameState
            }));

        }

        // Movable objects should be completed and removed from the game state before we advance the level
        // It is tempting to add gameState.alerts.length to the list, but I don't want a hidden way to pause the game
        if (0 === gameState.monsters.length
            && 0 === gameState.spawners.length
            && 0 === gameState.particles.length
            && 0 === gameState.projectiles.length
            && 100 !== gameState.level) {

            gameState.level++;

        }

    }

}


canvas.addEventListener('wheel', function (event) {

    // Use event.deltaY for vertical mouse wheel event to scroll horizontally
    if (event.deltaX) {

        scrollGridX(event.deltaX); // Scroll right

    }

    if (event.deltaY) {

        scrollGridY(-event.deltaY)

    }

}, {passive: true});

// Turret placement (example on grid click, extend with dragDropState for actual drag & drop)
canvas.addEventListener('click', function (event) {

    const rect = canvas.getBoundingClientRect();

    const x = event.clientX - rect.left;

    const y = event.clientY - rect.top;

    const headerHeight = GameHeaderHeight();

    if (y < headerHeight) {

        console.log('Clicked on the header');

        return;

    }

    const footerHeight = GameFooterHeight();

    if (y > window.innerHeight - footerHeight) {

        handleFooterClick(gameState, {x, y});

        return;

    }

    const gameGridPosition = getGameGridPosition(x, y);

    // Place turret if the cell is free
    if (gameGridPosition) {

        if (isSpaceAvailable(gameGridPosition.x, gameGridPosition.y, gameState.selectedTurret.w, gameState.selectedTurret.h, gameState)) {

            const selectedTurret = gameState.selectedTurret;


            if (gameState.energy < selectedTurret.cost) {

                gameState.alerts.push(new Alert({
                    message: 'Not enough energy to place a turret',
                    seconds: 5,
                }));

                console.warn('Not enough energy to place a turret');

                return;

            }

            gameState.energy -= selectedTurret.cost;

            const newTurret = new Turret({
                ...selectedTurret,
                x: gameGridPosition.x,
                y: gameGridPosition.y,
                gameState: gameState
            });

            gameState.turrets.push(newTurret);

        } else if (gameState.gameGrid[gameGridPosition.y][gameGridPosition.x] === 3) { // we just clicked on an existing turret

            console.log('Turret already placed here');

            // Check if the space belongs to an already placed turret
            const existingTurret = gameState.turrets.find(t =>
                gameGridPosition.x >= t.x &&
                gameGridPosition.x < t.x + t.w &&
                gameGridPosition.y >= t.y &&
                gameGridPosition.y < t.y + t.h
            );

            if (existingTurret) {

                existingTurret.upgrade();

            }

        } else {

            console.warn('Cell is not free', x / gameState.cellSize, y / gameState.cellSize, gameState);

        }

        return;

    }

    // this should never happen
    console.error('Out of bounds', x, y);

});

document.addEventListener('keydown', function (event) {

    console.log('Keydown event', event.code);

    if (event.code === 'Space') {

        if (FPS() < 30) {

            console.warn('FPS is too low to continue');

            gameState.alerts.push(new Alert({
                message: 'Your FPS being < 30 is too low to continue',
                seconds: 5,
            }))

            return;

        }

        gameState.level++;

        gameState.alerts.push(new Alert({
            message: 'The space bar was pressed! Spawning wave (' + gameState.level + ') early!',
            seconds: 5,
            fillStyle: 'rgb(0, 255, 0)',
        }))

        gameState.level++;

    }

    // note - good 4 testing renderGame()

    // be sure to render the final game board before exiting, aka don't change the order of these two lines
    if (gameState.status !== 'playing') {

        createAndShowModal('Game Over! You ' + gameState.status + '!', gameState);

        return;

    }

}, {passive: true});

canvas.addEventListener('mousemove', (event) => {
    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;
    gameState.mousePosition = {x: mouseX, y: mouseY}
}, {passive: true});

let touchStartX = 0;
let touchStartY = 0;

canvas.addEventListener('touchstart', function (event) {
    touchStartX = event.touches[0].clientX;
    touchStartY = event.touches[0].clientY;
    // Prevent default scrolling behavior on touch devices
    event.preventDefault();
}, {passive: true});

canvas.addEventListener('touchmove', function (event) {
    const touchEndX = event.touches[0].clientX;
    const touchEndY = event.touches[0].clientY;

    // Calculate the difference in touch position
    const deltaX = touchEndX - touchStartX;
    const deltaY = touchEndY - touchStartY;

    // Update the touch start position for the next move
    touchStartX = touchEndX;
    touchStartY = touchEndY;

    // Use the scroll functions to update the game state based on the touch movement
    scrollGridX(-deltaX);
    scrollGridY(deltaY);

    // Prevent default scrolling behavior on touch devices
}, {passive: true});

// Prevent default behavior for touchend as well
canvas.addEventListener('touchend', function (event) {
    event.preventDefault();
}, {passive: true});

