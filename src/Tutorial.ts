import FPS from "./FPS";
import Alert from "./Alert";
import {tGameState} from "./InitialState";


export default function Tutorial(gameState: tGameState) {


    if (undefined === gameState.tutorial) {
        return;
    }

    const keys = Object.keys(gameState.tutorial);

    keys.forEach((key) => {

        if (true === gameState.tutorial[key]) {
            return;
        }

        switch (key) {
            case 'welcome':

                gameState.alerts.push(new Alert({
                    message: "Welcome to Game Defence! Click on the grid to place a turret. Survive 100 waves to win!",
                    seconds: 15,
                    fillStyle: 'rgb(0, 255, 0)',
                    gameState,
                }))

                gameState.tutorial.welcome = true;

                break;

            case 'spaceBar':

                if (gameState.alerts.length > 0 || gameState.elapsedTimeSeconds < 10 || FPS() < 30) {
                    return;
                }

                gameState.alerts.push(new Alert({
                    message: "Pressing the space bar will spawn a new wave early and help multiply your score!",
                    seconds: 20,
                    fillStyle: 'rgb(137,33,189)',
                    gameState
                }));

                gameState.tutorial.spaceBar = true;

                break;

        }

    })


}