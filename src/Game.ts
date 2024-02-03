import {getGameGridPosition, isSpaceAvailable} from "./Position";
import monsterImage from "./assets/svg/MonsterSVG";
import FPS from "./FPS";
import DrawGameGrid from "./Grid";
import {createAndShowModal} from "./Modal";
import Spawner from "./Spawner";
import {InitialGameState} from "./InitialState";
import {showTurretRadius, Turret} from "./Turret";
import Footer, {
    GameFooterHeight, handleFooterClick, dictionary
} from "./Footer";
import CellSize from "./CellSize";
import GameHeaderHeight from "./HeaderHeight";
import {DrawGameTargets} from "./Targets";
import Header from "./Header";
import canvas from "./Canvas";

const ctx = canvas.getContext('2d')!;

export function getCanvasContext(): CanvasRenderingContext2D {
    return ctx;
}

// Game state
let gameState = InitialGameState()

export function getGameState() {
    return gameState;
}

export function setGameState(state: typeof gameState) {
    gameState = state;
}

// Function to create a radial gradient for orbs
// Game rendering function
export default function Game() {

    // Clear the entire canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Save the current context state (with no translations)
    ctx.save();

    canvas.height = window.innerHeight;

    canvas.width = window.innerWidth;

    const cellSize = CellSize(gameState);

    Header(ctx, gameState);

    // draw footer
    Footer(ctx, gameState)


    // move the grid context to the "Game Grid" position
    ctx.save();

    // Translate the context for horizontal scrolling of the game grid
    ctx.translate(-gameState.offsetX, gameState.offsetY + GameHeaderHeight());//headerHeight

    DrawGameGrid(ctx, gameState);

    // game objectives
    DrawGameTargets(ctx, gameState);

    if (gameState.processedLevel < gameState.level) {

        gameState.processedLevel++;

        gameState.spawners.push(new Spawner(100 / gameState.level, gameState.level * 5));

    }

    // Update turrets and draw them
    for (const turret of gameState.turrets) {

        turret.update(gameState.monsters, gameState);

        turret.draw(ctx, gameState, cellSize);

    }

    // remove projectile from game state - remove any destroyed projectiles so were not running this loop often
    gameState.projectiles = gameState.projectiles.filter(projectile => {

        if (!projectile.move()) { // If the projectile is destroyed, it will be removed by the filter next iteration of game loop

            return false;

        }

        projectile.draw(ctx, cellSize);

        return true;

    }) ?? [];

    gameState.monsters = gameState.monsters.filter(monster => {

        const cellSize = CellSize(gameState); // Assuming you have a function to get cell size

        // Existing code to move the monster
        if (false === monster.move(gameState, cellSize)) {

            return false;

        }

        // Draw the monster using the blue 3D diamond SVG image
        monster.draw(ctx, cellSize);

        return true

    }) ?? [];

    gameState.spawners = gameState.spawners.filter(spawner => spawner.update(gameState));

    // this may or may not show the turret radius, depending on the mouse position
    showTurretRadius(ctx, gameState.mousePosition);

    ctx.restore();

    gameState.particles = gameState.particles.filter(particle => {

        if (particle.updatePosition()) {

            particle.draw(ctx);

            return true;

        }

        return false;

    });

    if (0 === gameState.monsters.length && 0 === gameState.spawners.length) {

        if (dictionary.length === gameState.level) {

            alert('Congratulations, you\'ve won!');

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

                alert('Not enough energy to place a turret. Requires (' + selectedTurret.cost + ') energy. You have (' + gameState.energy + ') energy.');

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
