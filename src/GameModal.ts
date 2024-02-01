import {gameLoop} from "./Game";
import {tGameState} from "./GamesState";


export function createAndShowModal(message : string, gameState : tGameState) {

    // Create the modal elements
    var modal = document.createElement('div');
    var modalContent = document.createElement('div');
    var modalMessage = document.createElement('h2');
    var restartButton = document.createElement('button');

    // Set the content
    modalMessage.innerText = message;
    restartButton.innerText = 'Restart Game';

    // Style the modal
    modal.style.display = 'flex';
    modal.style.position = 'fixed';
    modal.style.left = '0';
    modal.style.top = '0';
    modal.style.width = '100%';
    modal.style.height = '100%';
    modal.style.backgroundColor = 'rgba(0, 0, 0, 0.4)';
    modal.style.justifyContent = 'center';
    modal.style.alignItems = 'center';

    modalContent.style.backgroundColor = 'white';
    modalContent.style.padding = '20px';
    modalContent.style.borderRadius = '10px';
    modalContent.style.textAlign = 'center';

    // Append elements
    modalContent.appendChild(modalMessage);
    modalContent.appendChild(restartButton);
    modal.appendChild(modalContent);
    document.body.appendChild(modal);

    // Restart button functionality
    restartButton.addEventListener('click', function () {
        // Reset game state
        gameState.level = 1;
        gameState.processedLevel = 0;
        gameState.startTime = (new Date()).getTime();
        gameState.energy = 0;
        gameState.score = 0;
        gameState.turrets = [];
        gameState.monsters = [];
        gameState.projectiles = [];
        gameState.spawners = [];
        gameState.status = 'playing';

        // Reset any other necessary variables
        // For example, if you have a variable for player's lives or health, reset it here

        // Hide the modal
        modal.style.display = 'none';

        // Optionally, reset the canvas or other UI elements
        // ...

        // Restart the game loop
        requestAnimationFrame(gameLoop);
    });

}
