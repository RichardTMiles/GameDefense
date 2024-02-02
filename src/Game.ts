import {getGameGridPosition} from "./Position";
import monsterImage from "./assets/svg/MonsterSVG";
import FPS from "./FPS";
import DrawGameGrid from "./Grid";
import {createAndShowModal} from "./Modal";
import {Spawner} from "./Monster";
import {InitialGameState} from "./InitialState";
import {showTurretRadius, Turret} from "./Turret";
import Footer, {
    GameFooterHeight, handleFooterClick, levelNames
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

        turret.draw(ctx, cellSize);

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
        ctx.drawImage(monsterImage, monster.position.x * cellSize, monster.position.y * cellSize, cellSize, cellSize);

        return true

    }) ?? [];

    gameState.spawners = gameState.spawners.filter(spawner => spawner.update(gameState));

    // this may or may not show the turret radius, depending on the mouse position
    showTurretRadius(ctx, gameState.mousePosition);

    ctx.restore();

    gameState.particles = gameState.particles.filter(particle => {

        if (particle.updatePosition(gameState)) {

            particle.draw(ctx);

            return true;

        }

        return false;

    });

    if (0 === gameState.monsters.length && 0 === gameState.spawners.length) {

        if (levelNames.length === gameState.level) {

            alert('Congratulations, you\'ve one!');

            return;

        }

        gameState.level++;

    }


}

canvas.addEventListener('wheel', function (event) {

    // Scroll function to update offsetX
    const scrollGridX = (amount: number) => {

        gameState.offsetX += amount;

        // Optionally add limits to prevent scrolling too far left or right
        gameState.offsetX = Math.max(0, Math.min(gameState.offsetX,
            CellSize(gameState) * gameState.gameGrid[0].length - window.innerWidth));

        Game();

    }

    const scrollGridY = (amount: number) => {

        // comment this out to allow vertical scrolling
        if (gameState.offsetY + amount !== 0) {

            return;

        }

        gameState.offsetY += amount;

        // Optionally add limits to prevent scrolling too far left or right
        gameState.offsetY = Math.max(0, Math.min(gameState.offsetY, CellSize(gameState) * gameState.gameGrid[0].length - window.innerWidth));

        Game();

    }

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

            if (gameState.gameGrid[gameGridPosition.y][gameGridPosition.x] === 2) {

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
                });

                gameState.turrets.push(newTurret);

                gameState.gameGrid[gameGridPosition.y][gameGridPosition.x] = 3; // Update the grid to indicate a turret is placed

            } else {

                console.warn('Cell is not free');

            }

            return;

        }

        // this should never happen
        console.error('Out of bounds', x, y);

    }
)
;

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

