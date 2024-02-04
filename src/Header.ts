import {getGameState} from "./Game";
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
const boxWidth = () => canvas.width / 5 - canvas.width / 5 / 2;
const boxcenter = () => Math.min(boxWidth(), GameHeaderHeight() / 2);

const boxPadding = () => (canvas.width - boxWidth() * 5) / 5;


export const waveCirclePosition = () => ({
    x: boxcenter() + boxPadding(),
    y: boxcenter(),
});

export const activeEnemyHealthCirclePosition = () => ({
    x: boxcenter() * 3 + boxPadding(),
    y: boxcenter(),
});
export const timeCirclePosition = () => ({
    x: boxcenter() * 5 + boxPadding(),
    y: boxcenter(),
});
export const energyCirclePosition = () => ({
    x: boxcenter() * 7 + boxPadding(),
    y: boxcenter(),
});
export const scoreCirclePosition = () => ({
    x: boxcenter() * 9 + boxPadding(),
    y: boxcenter(),
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
    ctx.fillStyle = 'rgba(255,0,255,0.17)'; // Dark gray background for header

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


    drawGradientCircleHeader(ctx, scoreCircle.x, scoreCircle.y, radius, 'rgba(255,255,255,0)', 'rgb(39,192,42)');
    ctx.fillStyle = 'rgba(255,255,255, .5)'; // White text color
    ctx.fillText('Score', scoreCircle.x, headerTextY, radius);
    ctx.fillText(formatNumber(gameState.score), scoreCircle.x, scoreCircle.y, radius);

    drawGradientCircleHeader(ctx, timeCircle.x, timeCircle.y, radius, 'rgba(255,255,255,0)', 'rgba(0,0,0,0.37)');
    ctx.fillStyle = 'rgba(255,255,255, .5)'; // White text color
    ctx.fillText('Time', timeCircle.x, headerTextY, radius);
    ctx.fillText(timeElapsed.toString(), timeCircle.x, timeCircle.y, radius);

    drawGradientCircleHeader(ctx, waveStrengthCircle.x, waveStrengthCircle.y, radius, 'rgba(255,255,255,0)', 'rgba(100,255,214,0.55)');
    ctx.fillStyle = 'rgba(255,255,255, .5)'; // White text color
    ctx.fillText('Strength', waveStrengthCircle.x, headerTextY, radius);
    ctx.fillText(formatNumber(gameState.monsters.reduce((previousValue, currentValue) => previousValue + currentValue.health, 0)), waveStrengthCircle.x, waveStrengthCircle.y, radius);


    // Set style for numbers within the circles


    // Draw numbers inside circles


    // Set style for descriptive text

    displayFPS(ctx);

}

