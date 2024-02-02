import GameBodyHeight from "./BodyHeight";
import canvas from "./Canvas";
import GameHeaderHeight from "./HeaderHeight";
import {tGameState} from "./State";


// Footer Levels
const getFooterButtons: string[] = [
    'NORMO', 'NORMO', 'SWARMO', 'NORMO', 'ZOOMO', 'NORMO', 'TOUGHO', 'NORMO', 'FLYBO', 'NORMO', "NORMO BOSS", "NORMO",
    "BOMBO", "NORMO", 'SWARMO', 'SWARMO BOSS', 'NORMO', 'ZOOMO', 'NORMO', 'FLYBO', 'NORMO', 'BOMBO', 'NORMO', 'TOUGHO',
    'ZOOMO', 'ZOOMO BOSS', 'NORMO', 'SWARMO', 'CHAMPO', 'TOUGHO BOSS', 'NORMO', 'IRONO', 'SWARMO', 'NORMO', 'ZOOMO', 'NORMO',
    'TOUGHO', 'FLYBO', 'FLYBO BOSS', 'NORMO', 'CHAMPO', 'BOMBO', 'BOMBO BOSS', 'NORMO', 'IRONO', 'BOMBO', 'NORMO', 'SWARMO',
    'CHAMPO', 'NORMO', 'IRONO', 'IRONO BOSS', 'NORMO', 'SWARMO', 'ZOOMO', 'TOUGHO', 'FLYBO', 'BOMBO', 'CHOMPO', 'IRONO',
    'NORMO', 'NORMO', 'AWESOMEO BOSS',
];


export function GameFooterHeight() {
    return window.innerHeight * .3;
} // Example height for the footer


export default function Footer(ctx: CanvasRenderingContext2D, gameState: tGameState) {

    ctx.save();

    // Translate the context for horizontal scrolling of the game grid
    ctx.translate(0, GameHeaderHeight() + GameBodyHeight());

    const footerHeight = GameFooterHeight();

    // Draw the footer background
    ctx.fillStyle = 'rgba(98,74,74,0.37)'; // Assuming a dark background for the footer

    ctx.fillRect(0, 0, canvas.width, footerHeight);

    // Draw the level background
    ctx.fillStyle = 'rgba(172,39,192,0.46)'; // Assuming a dark background for the footer

    ctx.fillRect(0, 0, canvas.width, footerHeight * .15);

    // Draw the buttons
    getFooterButtons.forEach((button, index) => {

        const x = (canvas.width / 2) + (100 * index) - (100 * gameState.level);

        const buttonActive = (index + 1) === gameState.level;

        ctx.fillStyle = buttonActive ? '#64c027' : '#ac27c0';

        ctx.fillRect(x, 0, 99, footerHeight * .15);

        ctx.fillStyle = 'rgb(255,255,255)'; // Text color

        ctx.textAlign = 'center';

        ctx.textBaseline = 'middle';

        ctx.font = 'bold 14px Arial';

        ctx.fillText(button, x + 50, 23);

    });

    const OneThird = canvas.width * (1 / 3);

    // Draw other footer elements like game stats
    ctx.fillStyle = 'rgba(0,207,250,0.64)'; // Text color
    ctx.fillRect(0, 0, OneThird, footerHeight);

    // You can also add images/icons by loading them and drawing them onto the canvas
    ctx.fillStyle = 'rgba(199,19,19,0.19)'; // Text color
    ctx.fillRect(OneThird, 0, OneThird, footerHeight);

    // Draw turrets in footer
    ctx.fillStyle = 'rgba(157,156,156,0.41)'; // Text color
    ctx.fillRect(OneThird * 2, 0, OneThird, footerHeight);

    ctx.restore();

}