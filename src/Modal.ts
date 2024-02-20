import State from "./State.ts";
import {startNewGame, tGameState} from "./InitialState";

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
        startNewGame();
    });

}
