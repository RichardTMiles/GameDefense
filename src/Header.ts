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
const boxWidth = () => canvas.width / 4;
const boxTextHeight = () => GameHeaderHeight() / 1.8;

export const waveCirclePosition = () => ({x: boxWidth() / 2, y: boxTextHeight(), radius: 30});
export const timeCirclePosition = () => ({x: boxWidth() * 1.5, y: boxTextHeight(), radius: 30});
export const energyCirclePosition = () => ({x: boxWidth() * 2.5, y: boxTextHeight(), radius: 30});
export const scoreCirclePosition = () => ({x: boxWidth() * 3.5, y: boxTextHeight(), radius: 30});


let lastLog = -1

export function secondsElapsed(gameState: tGameState) {

    const endTime = new Date();

    let timeDiff = endTime.getTime() - gameState.startTime; //in ms

    // strip the ms
    timeDiff /= 1000;


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

function formatNumber(num: number) : string{
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 10000) {
        return (num / 1000).toFixed(1) + 'k';
    } else {
        return num.toString();
    }
}


export default function Header(ctx: CanvasRenderingContext2D, gameState: any) {

    const headerHeight = GameHeaderHeight(); // Example height for the header

    // Draw header
    ctx.fillStyle = '#444'; // Dark gray background for header

    ctx.fillRect(0, 0, canvas.width, headerHeight);

    // Add text for level info
    ctx.fillStyle = '#fff'; // White text

    ctx.font = '20px Arial';

    const timeElapsed = secondsElapsed(gameState);

    const waveCircle = waveCirclePosition();

    const timeCircle = timeCirclePosition();

    const energyCircle = energyCirclePosition();

    const scoreCircle = scoreCirclePosition();

    drawGradientCircleHeader(ctx, waveCircle.x, waveCircle.y, waveCircle.radius, 'rgb(255,217,200)', 'rgb(215,103,33)');

    drawGradientCircleHeader(ctx, timeCircle.x, timeCircle.y, timeCircle.radius, 'rgb(255,200,200)', 'rgb(255,100,100)');

    drawGradientCircleHeader(ctx, energyCircle.x, energyCircle.y, energyCircle.radius, 'rgb(200,255,200)', 'rgb(100,255,100)');

    drawGradientCircleHeader(ctx, scoreCircle.x, scoreCircle.y, scoreCircle.radius, 'rgb(200,200,255)', 'rgb(100,100,255)');

    // Set style for descriptive text
    ctx.fillStyle = '#fff'; // White text color
    ctx.font = 'bold 20px Arial';
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';

    // Draw descriptive text next to circles
    ctx.fillText("Waves", waveCircle.x - waveCircle.radius - textPadding, waveCircle.y);

    ctx.fillText("Time", timeCircle.x - timeCircle.radius - textPadding, timeCircle.y);

    ctx.fillText("Energy", energyCircle.x - energyCircle.radius - textPadding, energyCircle.y);

    ctx.fillText("Score", scoreCircle.x - scoreCircle.radius - textPadding, scoreCircle.y);

    // Set style for numbers within the circles
    ctx.fillStyle = 'black'; // Black text color

    ctx.textAlign = 'center';

    // Draw numbers inside circles
    ctx.fillText(gameState.level, waveCircle.x, waveCircle.y);

    ctx.fillText(timeElapsed.toString(), timeCircle.x, timeCircle.y);

    ctx.fillText(formatNumber(gameState.energy), energyCircle.x, energyCircle.y);

    ctx.fillText(formatNumber(gameState.score), scoreCircle.x, scoreCircle.y);

    displayFPS(ctx);

}

