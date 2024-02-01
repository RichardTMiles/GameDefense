import {createAndShowModal} from "./GameModal";
import {Spawner} from "./GameMonster";
import GameState from "./GamesState";
import {Turret} from "./GameTurret";
import {drawFooter} from "./GameFooter";
import GameCellSize from "./GameCellSize";
import GameHeaderHeight from "./GameHeaderHeight";
import {DrawGameTargets} from "./GameTargets";
import gameGrid from "./GameGrid";
import {drawGradientCircleHeader} from "./GameHeader";
import canvas from "./GameCanvas";

const ctx = canvas.getContext('2d')!;

// Game state
const gameState = GameState

function secondsElapsed() {

    const endTime = new Date();

    let timeDiff = endTime.getTime() - gameState.startTime; //in ms

    // strip the ms
    timeDiff /= 1000;

    // get seconds
    return Math.round(timeDiff);

}

const borderWidth = 1; // You can adjust the thickness of the border here

// Function to create a radial gradient for orbs
// Game rendering function
function renderGame() {

    // Clear the entire canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    gameState.rotationX += 0.01; // Adjust rotation speed

    gameState.rotationY += 0.01;

    // Save the current context state (with no translations)
    ctx.save();

    canvas.height = window.innerHeight;

    canvas.width = window.innerWidth;

    const headerHeight = GameHeaderHeight(); // Example height for the header


    // Define the game grid dimensions
    // Define the size of each cell
    const cellSize = GameCellSize(gameState);

    // Draw header
    ctx.fillStyle = '#444'; // Dark gray background for header

    ctx.fillRect(0, 0, canvas.width, headerHeight);

    // Add text for level info
    ctx.fillStyle = '#fff'; // White text

    ctx.font = '20px Arial';

    const timeElapsed = secondsElapsed();

    const textPadding = 10;
    const boxWidth = canvas.width / 4;
    const boxTextHeight = GameHeaderHeight() / 1.8;

    const waveCircle = {x: boxWidth / 2, y: boxTextHeight, radius: 30};
    const timeCircle = {x: boxWidth * 1.5, y: boxTextHeight, radius: 30};
    const energyCircle = {x: boxWidth * 2.5, y: boxTextHeight, radius: 30};
    const scoreCircle = {x: boxWidth * 3.5, y: boxTextHeight, radius: 30};

    drawGradientCircleHeader(ctx, waveCircle.x, waveCircle.y, waveCircle.radius, 'rgb(255,217,200)', 'rgb(215,103,33)');
    drawGradientCircleHeader(ctx, timeCircle.x, timeCircle.y, timeCircle.radius, 'rgb(255,200,200)', 'rgb(255,100,100)');
    drawGradientCircleHeader(ctx, energyCircle.x, energyCircle.y, energyCircle.radius, 'rgb(200,255,200)', 'rgb(100,255,100)');
    drawGradientCircleHeader(ctx, scoreCircle.x, scoreCircle.y, scoreCircle.radius, 'rgb(200,200,255)', 'rgb(100,100,255)');

    // Set style for descriptive text
    ctx.fillStyle = '#fff'; // White text color
    ctx.font = 'bold 20px Arial';
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';

    // Draw descriptive text next to circles
    ctx.fillText("Waves", waveCircle.x - waveCircle.radius - textPadding, waveCircle.y);
    ctx.fillText("Time", timeCircle.x - timeCircle.radius - textPadding, timeCircle.y);
    ctx.fillText("Energy", energyCircle.x - energyCircle.radius - textPadding, energyCircle.y);
    ctx.fillText("Score", scoreCircle.x - scoreCircle.radius - textPadding, scoreCircle.y);

    // Set style for numbers within the circles
    ctx.fillStyle = 'black'; // Black text color
    ctx.textAlign = 'center';

    // Draw numbers inside circles
    ctx.fillText(`${gameState.level}`, waveCircle.x, waveCircle.y);
    ctx.fillText(`${timeElapsed}`, timeCircle.x, timeCircle.y);
    ctx.fillText(`${gameState.energy}`, energyCircle.x, energyCircle.y);
    ctx.fillText(`${gameState.score}`, scoreCircle.x, scoreCircle.y);

    // draw footer
    drawFooter(ctx, gameState)

    // Translate the context for horizontal scrolling of the game grid
    ctx.translate(-gameState.offsetX, gameState.offsetY + GameHeaderHeight());//headerHeight

    for (let y = 0; y < gameGrid.length; y++) {

        for (let x = 0; x < gameGrid[y].length; x++) {

            const cellX = x * cellSize;

            const cellY = y * cellSize;

            // Paths are not drawn as they are the default background
            switch (gameGrid[y][x]) {
                case 0:
                    // Draw path
                    ctx.fillStyle = 'rgba(98,74,74,0.37)'; // Black
                    ctx.fillRect(cellX, cellY, cellSize, cellSize);
                    break;
                case 1:
                    // Draw wall
                    ctx.fillStyle = '#FF00FF'; // Purple
                    ctx.fillRect(cellX, cellY, cellSize, cellSize);
                    break;
                case 2:
                    // Draw wall
                    ctx.fillStyle = '#31b0c3'; // Purple
                    ctx.fillRect(cellX, cellY, cellSize, cellSize);
                    break;
                case 3:
                    // Draw orb
                    ctx.fillStyle = '#d30505'; // Black
                    ctx.fillRect(cellX, cellY, cellSize, cellSize);
                    ctx.fillStyle = '#27c02a';
                    ctx.beginPath();
                    ctx.arc((cellX) + (cellSize / 2), (cellY) + (cellSize / 2), cellSize / 3, 0, Math.PI * 2);
                    ctx.fill();
                    break;
            }

            // Draw the border around the cell
            ctx.strokeStyle = 'rgba(15,15,15,0.23)'; // Black color for the border

            ctx.lineWidth = borderWidth;

            ctx.strokeRect(cellX + borderWidth / 2, cellY + borderWidth / 2, cellSize - borderWidth, cellSize - borderWidth);

        }

    }

    // game objectives
    DrawGameTargets(ctx, gameState);

    if (gameState.processedLevel < gameState.level) {

        gameState.processedLevel++;

        gameState.spawners.push(new Spawner(100 / gameState.level, gameState.level * 5));

    }

    // Update turrets and draw them
    for (const turret of gameState.turrets) {

        turret.update(gameState.monsters);

        ctx.fillStyle = 'rgba(172,39,192,0.66)'; // Color of the monster

        ctx.beginPath();

        ctx.fillRect(turret.x * cellSize, turret.y * cellSize, cellSize, cellSize);

        ctx.fill();

    }

    for (const projectile of gameState.projectiles) {

        if (undefined === projectile.target || true === projectile.isDestroyed) {

            // remove projectile from game state
            gameState.projectiles = gameState.projectiles.filter(p => p !== projectile);

            continue;

        }

        projectile.move();

        ctx.fillStyle = 'rgba(0,0,0,0.37)'; // Color of the monster

        ctx.beginPath();

        ctx.fillRect(projectile.x * cellSize, projectile.y * cellSize, cellSize, cellSize);

        ctx.fill();

    }

    for (const monster of gameState.monsters) {

        if (monster.health <= 0) {
            gameState.score += 10 * gameState.level
            gameState.energy += 10 * gameState.level
            gameState.monsters = gameState.monsters.filter(m => m !== monster);
            continue;
        }

        const cellSize = GameCellSize(gameState); // Assuming you have a function to get cell size

        // Draw the monster using the blue 3D diamond SVG image
        ctx.drawImage(monsterImage, monster.position.x * cellSize, monster.position.y * cellSize, cellSize, cellSize);

        // Existing code to move the monster
        monster.move(gameState);
    }

    for (const spawner of gameState.spawners) {

        if (false === spawner.update(gameState)) {

            gameState.spawners = gameState.spawners.filter(s => s !== spawner);

        }

    }

    if (0 === gameState.monsters.length && 0 === gameState.spawners.length) {

        gameState.level++;

    }


}

canvas.addEventListener('wheel', function (event) {

    // Scroll function to update offsetX
    const scrollGridX = (amount: number) => {

        gameState.offsetX += amount;

        // Optionally add limits to prevent scrolling too far left or right
        gameState.offsetX = Math.max(0, Math.min(gameState.offsetX, GameCellSize(gameState) * gameGrid[0].length - window.innerWidth));

        renderGame();

    }

    /*const scrollGridY = (amount: number) => {

        gameState.offsetY += amount;

        // Optionally add limits to prevent scrolling too far left or right
        gameState.offsetY = Math.max(0, Math.min(gameState.offsetY, GameCellSize(gameState) * gameGrid[0].length - window.innerWidth));

        renderGame();

    }*/

    // Use event.deltaY for vertical mouse wheel event to scroll horizontally
    if (event.deltaX) {

        scrollGridX(event.deltaX); // Scroll right

    }

    /*if (event.deltaY) {

        scrollGridY(event.deltaY)

    }*/

}, {passive: true});

// Turret placement (example on grid click, extend with dragDropState for actual drag & drop)
canvas.addEventListener('click', function (event) {

    const rect = canvas.getBoundingClientRect();

    const x = event.clientX - rect.left + gameState.offsetX;

    const y = event.clientY - rect.top - GameHeaderHeight();

    const cellSize = GameCellSize(gameState);

    // Convert click position to grid coordinates
    const gridX = Math.floor(x / cellSize);

    const gridY = Math.floor(y / cellSize);

    // Place turret if the cell is free
    if (gameGrid[gridY][gridX] === 2) {

        gameState.energy -= 10;

        const newTurret = new Turret(gridX, gridY, 5, 10); // Range and damage values are examples

        gameState.turrets.push(newTurret);

        gameGrid[gridY][gridX] = 2; // Update the grid to indicate a turret is placed

    }

});

const monsterImage = new Image();

const monsterSVG = (color1 = 'rgb(134,30,30)', color2 = 'rgb(0,191,255)') => `
<svg width="40" height="40" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" style="stop-color: ${color1};stop-opacity:1" />
      <stop offset="100%" style="stop-color: ${color2};stop-opacity:1" />
    </linearGradient>
  </defs>
  <polygon points="20,0 40,20 20,40 0,20" fill="url(#grad1)" stroke="blue" stroke-width="2"/>
  <path d="M 0 20 L 20 0 L 40 20 L 20 40 Z" fill="none" stroke="black" stroke-width="1" opacity="0.5"/>
</svg>`;

monsterImage.src = 'data:image/svg+xml;base64,' + btoa(monsterSVG());

document.addEventListener('keydown', function (event) {

    if (event.code === 'Space') {

        // Your code here
        console.log('Spacebar was pressed');

        gameState.level++;

    }

}, {passive: true});

// Main game loop
export function gameLoop() {

    // Render the game
    renderGame();

    // be sure to render the final game board before exiting, aka don't change the order of these two lines
    if (gameState.status !== 'playing') {

        createAndShowModal('Game Over! You ' + gameState.status + '!', gameState);

        return;

    }


    // Call the next frame
    requestAnimationFrame(gameLoop);

}

