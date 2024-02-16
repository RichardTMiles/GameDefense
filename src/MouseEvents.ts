import Alert from "Alert";
import {getGameGridPosition, isSpaceAvailable} from "Position";
import {Turret} from "Turret";
import {eGameDisplayState, tGameState} from "InitialState";
import {getGameState} from "GameDefense";
import canvas from "Canvas";
import {scrollGridX, scrollGridY} from "Scroll";
import GameHeaderHeight from "HeaderHeight";
import {GameFooterHeight, handleFooterClick} from "Footer";


export default function MouseEvents() {

    console.log('MouseEvents');

    canvas.addEventListener('mousemove', (event) => {
        const gameState = getGameState();
        const rect = canvas.getBoundingClientRect();
        const mouseX = (event.clientX - rect.left) ?? 0;
        const mouseY = (event.clientY - rect.top) ?? 0;
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


    // Turret placement (example on grid click, extend with dragDropState for actual drag & drop)
    canvas.addEventListener('click', function (event) {
        const gameState = getGameState();

        if (gameState.gameDisplayState !== eGameDisplayState.GAME) {
            console.log('Mouse click out of game');
            return;
        }

        console.log('Mouse click in game');

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

}