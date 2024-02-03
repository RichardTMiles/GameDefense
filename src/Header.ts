import headerHeight from "./HeaderHeight";
import {tGameState} from "./InitialState";
import {displayFPS} from "./FPS";
import canvas from "./Canvas";
import CellSize from "./CellSize";
import GameHeaderHeight from "./HeaderHeight";

export function drawGradientCircleHeader(ctx: CanvasRenderingContext2D, x: number, y: number, radius: number, colorStart: string, colorEnd: string) {
    let gradient = ctx.createRadialGradient(x, y, radius * 0.1, x, y, radius);
    gradient.addColorStop(0, colorStart);
    gradient.addColorStop(1, colorEnd);
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fillStyle = gradient;
    ctx.fill();
}


const textPadding = 10;
const boxWidth = () => canvas.width / 6;
const boxTextHeight = () => Math.min(boxWidth(), GameHeaderHeight() / 2);

export const waveCirclePosition = () => ({
    x: boxWidth(),
    y: boxTextHeight(),
});

export const activeEnemyHealthCirclePosition = () => ({
    x: boxWidth() * 2,
    y: boxTextHeight(),
});
export const timeCirclePosition = () => ({
    x: boxWidth() * 3,
    y: boxTextHeight(),
});
export const energyCirclePosition = () => ({
    x: boxWidth() * 4,
    y: boxTextHeight(),
});
export const scoreCirclePosition = () => ({
    x: boxWidth() * 5,
    y: boxTextHeight(),
});


let lastLog = -1

export function elapsedTime(gameState: tGameState, inSeconds: boolean = true) {

    const endTime = new Date();

    let timeDiff = endTime.getTime() - gameState.startTime; //in ms

    // strip the ms
    timeDiff /= 1000;

    if (false === inSeconds) {

        return timeDiff;

    }

    const seconds = Math.round(timeDiff);

    if (0 === seconds % 10 && lastLog !== seconds) {

        lastLog = seconds

        console.groupCollapsed('0 === seconds % 10', seconds)

        console.log('gameState', gameState);

        console.groupEnd()

    }

    // get seconds
    return seconds;

}

export function formatNumber(num: number): string {
    if (num >= 1000000000) {
        return (num / 1000000000).toFixed(1) + 'B';
    }

    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M';
    }

    if (num >= 10000) {
        return (num / 1000).toFixed(1) + 'k';
    }

    return num.toString();

}


export default function Header(ctx: CanvasRenderingContext2D, gameState: tGameState) {

    const headerHeight = GameHeaderHeight(); // Example height for the header

    // Draw header
    ctx.fillStyle = '#444'; // Dark gray background for header

    ctx.fillRect(0, 0, canvas.width, headerHeight);

    // Add text for level info
    ctx.fillStyle = '#fff'; // White text

    ctx.font = '2em Arial';

    const timeElapsed = elapsedTime(gameState);

    const waveCircle = waveCirclePosition();

    const timeCircle = timeCirclePosition();

    const energyCircle = energyCirclePosition();

    const scoreCircle = scoreCirclePosition();

    const waveStrengthCircle = activeEnemyHealthCirclePosition();

    drawGradientCircleHeader(ctx, waveCircle.x, waveCircle.y, waveCircle.y, 'rgba(255,255,255,0)', 'rgb(215,103,33)');

    drawGradientCircleHeader(ctx, timeCircle.x, timeCircle.y, timeCircle.y, 'rgba(255,255,255,0)', 'rgb(255,0,0)');

    drawGradientCircleHeader(ctx, energyCircle.x, energyCircle.y, energyCircle.y, 'rgba(255,255,255,0)', 'rgb(31,152,0)');

    drawGradientCircleHeader(ctx, scoreCircle.x, scoreCircle.y, scoreCircle.y, 'rgba(255,255,255,0)', 'rgb(197,185,47)');

    drawGradientCircleHeader(ctx, waveStrengthCircle.x, waveStrengthCircle.y, waveStrengthCircle.y, 'rgba(255,255,255,0)', 'rgb(100,255,214)');


    // Set style for numbers within the circles
    ctx.fillStyle = 'white'; // Black text color

    ctx.textAlign = 'center';

    // Draw numbers inside circles
    ctx.fillText(gameState.level.toString(), waveCircle.x, waveCircle.y);
    ctx.fillText(timeElapsed.toString(), timeCircle.x, timeCircle.y);
    ctx.fillText(formatNumber(gameState.energy), energyCircle.x, energyCircle.y);
    ctx.fillText(formatNumber(gameState.score), scoreCircle.x, scoreCircle.y);
    ctx.fillText(formatNumber(gameState.monsters.reduce((previousValue, currentValue) => previousValue + currentValue.health, 0)), waveStrengthCircle.x, waveStrengthCircle.y);


    // Set style for descriptive text
    ctx.fillStyle = '#fff'; // White text color
    const headerTextY = scoreCircle.y + scoreCircle.y / 2;
    ctx.fillText('Energy', energyCircle.x, headerTextY);
    ctx.fillText('Score', scoreCircle.x, headerTextY);
    ctx.fillText('Wave', waveCircle.x, headerTextY);
    ctx.fillText('Time', timeCircle.x, headerTextY);
    ctx.fillText('Strength', waveStrengthCircle.x, headerTextY);

    displayFPS(ctx);

}

