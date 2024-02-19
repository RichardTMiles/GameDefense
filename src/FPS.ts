import State from "./State.ts";

let fps = 60; // Initial assumption
let frameCount = 0;
let startTime = Date.now();
let currentTime = 0;
let previousTime = startTime;


export function displayFPS(ctx: CanvasRenderingContext2D) {

    const fps = FPS();
    // Assuming `ctx` is your canvas 2D context
    ctx.fillStyle = 'rgba(225,225,225,0.15)'; // Choose a text color that contrasts your background
    ctx.fillRect(State.canvas.width - 100, 0, 100, 50); // Optional: Draw a background for the FPS text
    ctx.fillStyle = 'black'; // Text color
    ctx.font = '20px Arial';
    ctx.fillText(`FPS: ${fps}`, State.canvas.width - 50, 30);
}

export default function FPS() {

    currentTime = Date.now();
    let elapsedTime = currentTime - previousTime;
    frameCount++;

    if (elapsedTime > 1000) { // Every second, update the FPS
        fps = frameCount;
        frameCount = 0;
        previousTime = currentTime;
    }

    return fps;

}