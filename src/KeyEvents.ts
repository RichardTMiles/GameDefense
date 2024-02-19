import State from "./State.ts";
import Alert from "./Alert.ts";
import FPS from "./FPS.ts";
import {eGameDisplayState} from "./InitialState.ts";



export default function KeyEvents() {

    document.addEventListener('keydown', function (event) {

        const {gameState} = State;

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

}


