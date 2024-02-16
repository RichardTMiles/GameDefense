import {getGameState} from "./GameDefense";
import {tGameState} from "./InitialState";
import {displayFPS} from "./FPS";
import canvas from "./Canvas";
import HeaderHeight from "./HeaderHeight";

export function drawGradientCircleHeader(ctx: CanvasRenderingContext2D, x: number, y: number, radius: number, colorStart: string, colorEnd: string) {
    let gradient = ctx.createRadialGradient(x, y, radius * 0.1, x, y, radius);
    gradient.addColorStop(0, colorStart);
    gradient.addColorStop(1, colorEnd);
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fillStyle = gradient;
    ctx.fill();
}


// the box full width - half to get the center
// NOTE- the below is derived from the equation = canvas.width / 5 - (canvas.width / 5 / 2);
const boxWidth = () => canvas.width / 12

export const waveCirclePosition = () => ({
    x: boxWidth(),
    y: HeaderHeight() / 2,
});

export const activeEnemyHealthCirclePosition = () => ({
    x: boxWidth() * 3,
    y: HeaderHeight() / 2,
});
export const timeCirclePosition = () => ({
    x: boxWidth() * 5,
    y: HeaderHeight() / 2,
});

export const loopCirclePosition = () => ({
    x: boxWidth() * 7,
    y: HeaderHeight() / 2,
});
export const energyCirclePosition = () => ({
    x: boxWidth() * 9,
    y: HeaderHeight() / 2,
});
export const scoreCirclePosition = () => ({
    x: boxWidth() * 11,
    y: HeaderHeight() / 2,
});

let lastLog = -1

export function elapsedTime(gameState: tGameState = getGameState(), inSeconds: boolean = true) {

    const endTime = new Date();

    let timeDiff = endTime.getTime() - gameState.startTime; //in ms

    // strip the ms
    timeDiff /= 1000;

    gameState.elapsedTime = timeDiff;

    const seconds = Math.round(timeDiff);

    if (0 === seconds % 10 && lastLog !== seconds) {

        lastLog = seconds

        console.groupCollapsed('0 === seconds % 10', seconds)

        console.log('gameState', gameState);

        console.groupEnd()

    }

    gameState.elapsedTimeSeconds = seconds;

    if (false === inSeconds) {

        return timeDiff;

    }

    // get seconds
    return seconds;

}

export function formatNumber(num: number): string {
    if (num >= 1.0e15) {
        return (num / 1.0e15).toFixed(1) + 'Q';
    }

    if (num >= 1.0e12) {
        return (num / 1.0e12).toFixed(1) + 'T';
    }

    if (num >= 1.0e9) {
        return (num / 1.0e9).toFixed(1) + 'B';
    }

    if (num >= 1.0e6) {
        return (num / 1.0e6).toFixed(1) + 'M';
    }

    if (num >= 1.0e3) {
        return (num / 1.0e3).toFixed(1) + 'k';
    }

    return num.toString();
}


export default function Header(ctx: CanvasRenderingContext2D, gameState: tGameState) {

    const headerHeight = HeaderHeight(); // Example height for the header

    // Draw header
    ctx.fillStyle = 'rgba(96,6,96,0.9)'; // Dark gray background for header

    ctx.fillRect(0, 0, canvas.width, headerHeight);

    // Add text for level info
    ctx.fillStyle = '#fff'; // White text

    ctx.font = '2em Arial';

    const timeElapsed = elapsedTime(gameState);

    const waveCircle = waveCirclePosition();

    const timeCircle = timeCirclePosition();

    const LoopCircle = loopCirclePosition();

    const energyCircle = energyCirclePosition();

    const scoreCircle = scoreCirclePosition();

    const waveStrengthCircle = activeEnemyHealthCirclePosition();

    const radius = waveCircle.y;
    const headerTextY = scoreCircle.y + scoreCircle.y / 2;
    ctx.textAlign = 'center';


    drawGradientCircleHeader(ctx, energyCircle.x, energyCircle.y, radius, 'rgba(255,255,255,0)', 'rgb(172,39,192)');
    ctx.fillStyle = 'rgba(255,255,255, .5)'; // White text color
    ctx.fillText(formatNumber(gameState.energy), energyCircle.x, energyCircle.y, radius);
    ctx.fillText('Energy', energyCircle.x, headerTextY, radius);

    drawGradientCircleHeader(ctx, waveCircle.x, waveCircle.y, radius, 'rgba(255,255,255,0)', 'rgba(215,103,33,0.62)');
    ctx.fillStyle = 'rgba(255,255,255, .5)'; // White text color
    ctx.fillText('Wave', waveCircle.x, headerTextY, radius);
    ctx.fillText(gameState.level.toString(), waveCircle.x, waveCircle.y, radius);

    drawGradientCircleHeader(ctx, scoreCircle.x, scoreCircle.y, radius, 'rgba(255,255,255,0)', 'rgb(37,108,38)');
    ctx.fillStyle = 'rgba(255,255,255, .5)'; // White text color
    ctx.fillText('Score', scoreCircle.x, headerTextY, radius);
    ctx.fillText(formatNumber(gameState.score), scoreCircle.x, scoreCircle.y, radius);

    drawGradientCircleHeader(ctx, timeCircle.x, timeCircle.y, radius, 'rgba(255,255,255,0)', 'rgba(0,0,0,0.37)');
    ctx.fillStyle = 'rgba(255,255,255, .5)'; // White text color
    ctx.fillText('Time', timeCircle.x, headerTextY, radius);
    ctx.fillText(formatNumber(timeElapsed), timeCircle.x, timeCircle.y, radius);

    drawGradientCircleHeader(ctx, LoopCircle.x, LoopCircle.y, radius, 'rgba(255,255,255,0)', 'rgb(33,161,189)');
    ctx.fillStyle = 'rgba(255,255,255, .5)'; // White text color
    ctx.fillText('Loops', LoopCircle.x, headerTextY, radius);
    ctx.fillText(formatNumber(gameState.ticks), LoopCircle.x, LoopCircle.y, radius);

    drawGradientCircleHeader(ctx, waveStrengthCircle.x, waveStrengthCircle.y, radius, 'rgba(255,255,255,0)', 'rgba(100,255,214,0.55)');
    ctx.fillStyle = 'rgba(255,255,255, .5)'; // White text color
    ctx.fillText('Strength', waveStrengthCircle.x, headerTextY, radius);
    ctx.fillText(formatNumber(gameState.monsters.reduce((previousValue, currentValue) => previousValue + currentValue.health, 0)), waveStrengthCircle.x, waveStrengthCircle.y, radius);


    // Set style for numbers within the circles


    // Draw numbers inside circles


    // Set style for descriptive text

    displayFPS(ctx);

}

