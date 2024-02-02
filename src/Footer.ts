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

    // Draw the buttons
    getFooterButtons.forEach((button, index) => {

        const x = (canvas.width / 3) + (100 * index);

        ctx.fillStyle = (index - 1) === gameState.level ? '#64c027' : '#ac27c0';

        ctx.fillRect(x, 0, 100, footerHeight * .15);

        ctx.fillStyle = 'rgb(255,255,255)'; // Text color

        ctx.textAlign = 'center';

        ctx.textBaseline = 'middle';

        ctx.font = 'bold 14px Arial';

        ctx.fillText(button, x + 50, 23);

    });

    // Draw other footer elements like game stats
    // ctx.fillRect(0, 0, canvas.width * .3, getFooterHeight());

    // You can also add images/icons by loading them and drawing them onto the canvas
    // ...

    // Draw turrets in footer
    // ... (Your logic to draw turret selection icons)

    ctx.restore();

}