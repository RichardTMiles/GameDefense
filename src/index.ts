// Start the game loop
import GameDefense from "./GameDefense";


let fpsInterval = 1000 / 35; // 35 FPS

let then = 0;

console.log('GameDefense', GameDefense);

async function gameLoop(now: number) {

    then = then || now;

    let elapsed = now - then;

    if (elapsed > fpsInterval) {

        then = now - (elapsed % fpsInterval);

        try {

            await GameDefense();

        } catch (e) {

            console.error(e);

            return;

        }

    }

    requestAnimationFrame(gameLoop);

}

requestAnimationFrame(gameLoop);
