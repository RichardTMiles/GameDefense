// Start the game loop
import Game from "./Game";


let fpsInterval = 1000 / 35; // 30 FPS

let then = 0;

function gameLoop(now:number) {

    requestAnimationFrame(gameLoop);

    then = then || now;

    let elapsed = now - then;

    if (elapsed > fpsInterval) {

        then = now - (elapsed % fpsInterval);

        Game();

    }

}

requestAnimationFrame(gameLoop);