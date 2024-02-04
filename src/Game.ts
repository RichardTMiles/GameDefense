import Alert from "./Alert";
import canvas from "./Canvas";
import CellSize from "./CellSize";
import Footer, {GameFooterHeight, handleFooterClick} from "./Footer";
import FPS from "./FPS";
import DrawGameGrid from "./Grid";
import Header, {elapsedTime} from "./Header";
import GameHeaderHeight from "./HeaderHeight";
import {InitialGameState, tGameState} from "./InitialState";
import iEntity from "./interfaces/iEntity";
import {createAndShowModal} from "./Modal";
import {getGameGridPosition, isSpaceAvailable} from "./Position";
import Spawner from "./Spawner";
import {DrawGameTargets} from "./Targets";
import {showTurretRadius, Turret} from "./Turret";

const context = canvas.getContext('2d')!;

export function getCanvasContext(): CanvasRenderingContext2D {
    return context;
}

// Game state
let gameState: tGameState = InitialGameState(context)

export function getGameState() {
    return gameState;
}

function handleIEntity(entity: iEntity): boolean {

    if (!entity.move(gameState)) { // If the projectile is destroyed, it will be removed by the filter next iteration of game loop

        return false;

    }

    entity.draw(context);

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

    // update the canvas size each frame, this handles window resizing
    canvas.height = window.innerHeight;

    canvas.width = window.innerWidth;

    // cell size is dynamic based on the canvas size
    gameState.cellSize = CellSize(gameState);

    // this will update the game state with the current and elapsed time
    elapsedTime(gameState, false);

    // draw header
    Header(context, gameState);

    // draw footer
    Footer(context, gameState)

    // move the grid context to the "Game Grid" position
    context.save();

    // Translate the (x,y) context for horizontal scrolling of the game grid. We will handle scrolling in the game not
    // the browser
    context.translate(-gameState.offsetX, gameState.offsetY + GameHeaderHeight());//headerHeight

    // game grid
    DrawGameGrid(context, gameState);

    // draw game objectives, the monsters will be targeting these locations with a pathfinding algorithm
    DrawGameTargets(context, gameState);

    // if any levels have been passed, add more spawners
    if (gameState.processedLevel < gameState.level) {

        gameState.processedLevel++;

        gameState.spawners.push(new Spawner(
            0 === gameState.level % 10
                ? {
                    interval: 0,
                    amount: Math.min(gameState.level / 2, 10),
                    speed: .01 * gameState.level + .2,
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

    // particle effects are drawn using a Bézier curve and a random control point
    gameState.particles = gameState.particles.filter(particle => handleIEntity(particle));

    // add a level advancement and winning condition
    if (0 === gameState.monsters.length && 0 === gameState.spawners.length) {

        if (100 === gameState.level) {

            gameState.alerts.push(new Alert({
                message: 'WINNER!',
                seconds: 20,
            }));

        }

        gameState.level++;

    }

}

// Scroll function to update offsetX
export const scrollGridX = (amount: number) => {

    gameState.offsetX += amount;

    // Optionally add limits to prevent scrolling too far left or right
    gameState.offsetX = Math.max(0, Math.min(gameState.offsetX,
        CellSize(gameState) * gameState.gameGrid[0].length - window.innerWidth));

    Game();

}

export const scrollGridY = (amount: number) => {

    // comment this out to allow vertical scrolling
    if (gameState.offsetY + amount !== 0) {

        return;

    }

    gameState.offsetY += amount;

    // Optionally add limits to prevent scrolling too far left or right
    gameState.offsetY = Math.max(0, Math.min(gameState.offsetY, CellSize(gameState) * gameState.gameGrid[0].length - window.innerWidth));

    Game();

}

canvas.addEventListener('wheel', function (event) {

    // Use event.deltaY for vertical mouse wheel event to scroll horizontally
    if (event.deltaX) {

        scrollGridX(event.deltaX); // Scroll right

    }

    if (event.deltaY) {

        scrollGridY(event.deltaY)

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

        } else {

            console.warn('Cell is not free');

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

            return;

        }

        // Your code here
        console.log('Spacebar was pressed');

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
});

let touchStartX = 0;
let touchStartY = 0;

canvas.addEventListener('touchstart', function (event) {
    touchStartX = event.touches[0].clientX;
    touchStartY = event.touches[0].clientY;
    // Prevent default scrolling behavior on touch devices
    event.preventDefault();
}, {passive: false});

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
    scrollGridX(deltaX);
    scrollGridY(deltaY);

    // Prevent default scrolling behavior on touch devices
    event.preventDefault();
}, {passive: false});

// Prevent default behavior for touchend as well
canvas.addEventListener('touchend', function (event) {
    event.preventDefault();
}, {passive: false});
