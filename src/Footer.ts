import {formatNumber} from "./Header";
import headerHeight from "./HeaderHeight";
import {
    eTurretTargetDimensionsLocation,
    iTurret,
    tTurretCallable,
    Turret1,
    Turret2,
    Turret3,
    Turret4,
    Turret5,
    Turret6
} from "./Turret";
import tGridPosition from "./tGridPosition";
import GameBodyHeight from "./BodyHeight";
import canvas from "./Canvas";
import GameHeaderHeight from "./HeaderHeight";
import {tGameState} from "./InitialState";


type tDictionary = { [key: string]: string };

let dictionaryLookupCache: tDictionary;

function randomizeObjectKeys(obj: { [key: string]: any }) {
    function shuffleArray(array: any[]) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    const keys = Object.keys(obj);

    shuffleArray(keys);

    const randomizedObj: { [key: string]: any } = {};

    keys.forEach(key => {
        randomizedObj[key] = obj[key]; // Reconstruct the object with shuffled keys
    });

    return randomizedObj;

}

// Footer Levels
export const dictionary: () => tDictionary = () => {

    // todo - fetch https://raw.githubusercontent.com/matthewreagan/WebstersEnglishDictionary/master/dictionary.json

    if (undefined === dictionaryLookupCache) {

        dictionaryLookupCache = {}

        fetch('https://raw.githubusercontent.com/matthewreagan/WebstersEnglishDictionary/master/dictionary.json')
            .then(response => response.json())
            .then(data => dictionaryLookupCache = randomizeObjectKeys(data))
            .catch(error => console.error('Error fetching dictionary', error));

    }

    return dictionaryLookupCache

}

function wrapText(context: CanvasRenderingContext2D, text: string, x: number, y: number, maxWidth: number, lineHeight: number) {
    const words = text.split(' ');
    let line = '';
    for (let n = 0; n < words.length; n++) {
        const testLine = line + words[n] + ' ';
        const metrics = context.measureText(testLine);
        const testWidth = metrics.width;
        if (testWidth > maxWidth && n > 0) {
            context.fillText(line, x, y);
            line = words[n] + ' ';
            y += lineHeight;
        } else {
            line = testLine;
        }
    }
    context.fillText(line, x, y);
}

export const footerLevelBarHeight = () => GameFooterHeight() * .5;
export const turretSectionHeight = () => GameFooterHeight() * .5;

export function GameFooterHeight() {
    return window.innerHeight * .25;
} // Example height for the footer


export const OneThirdFooter = () => canvas.width / 3;

export interface iTurretInfo extends tGridPosition, iTurret {
    w: number,
    h: number,
    fillStyle: string
}


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

    ctx.fillRect(0, 0, canvas.width, footerLevelBarHeight());


    const fullDictionary = dictionary();

    const allLevels = Object.keys(fullDictionary);

    const levelBarHeight = footerLevelBarHeight();

    // Draw the buttons
    allLevels.forEach((button, index) => {

        if (10 < Math.abs(gameState.level - index + 1)) {

            return

        }

        const x = (canvas.width / 2) + (100 * index) - (100 * gameState.level);

        const buttonActive = (index + 1) === gameState.level;

        ctx.fillStyle = buttonActive ? '#64c027' : '#ac27c0';

        ctx.fillRect(x, 0, 99, levelBarHeight);

        ctx.fillStyle = 'rgb(255,255,255)'; // Text color

        ctx.textAlign = 'center';

        ctx.textBaseline = 'middle';

        ctx.font = 'bold 14px Arial';

        ctx.fillText(button, x + 50, levelBarHeight / 2);

    });

    const OneThird = OneThirdFooter();

    // Draw other footer elements like game stats
    ctx.fillStyle = gameState.selectedTurret.fillStyle; // Text color
    ctx.fillRect(0, 0, OneThird, levelBarHeight);

    // You can also add images/icons by loading them and drawing them onto the canvas
    ctx.fillStyle = 'rgba(199,19,19,0.19)'; // Text color
    ctx.fillRect(OneThird, 0, OneThird, footerHeight);

    // Draw the wave strength
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = 'bold 3em Arial';
    ctx.fillStyle = 'rgb(255,255,255)'; // Text color

    const currentLevel = allLevels[gameState.level - 1] ?? 'Loading!';

    wrapText(ctx, fullDictionary[currentLevel] ?? '', OneThird / 2, levelBarHeight * .2, OneThird, 60 );

    // Draw turrets in footer turret section
    ctx.fillStyle = 'rgba(19,82,199,0.56)'; // Text color
    ctx.fillRect(OneThird, footerLevelBarHeight(), OneThird, turretSectionHeight());

    // Turret 1
    const turret1 = Turret1(eTurretTargetDimensionsLocation.FOOTER);
    ctx.fillStyle = turret1.fillStyle; // Text color
    ctx.fillRect(turret1.x, turret1.y, turret1.w, turret1.h);

    // Turret 2
    const turret2 = Turret2(eTurretTargetDimensionsLocation.FOOTER);
    ctx.fillStyle = turret2.fillStyle; // Text color
    ctx.fillRect(turret2.x, turret2.y, turret2.w, turret2.h);

    // Turret 3
    const turret3 = Turret3(eTurretTargetDimensionsLocation.FOOTER);
    ctx.fillStyle = turret3.fillStyle; // Text color
    ctx.fillRect(turret3.x, turret3.y, turret3.w, turret3.h);

    // Turret 4
    const turret4 = Turret4(eTurretTargetDimensionsLocation.FOOTER);
    ctx.fillStyle = turret4.fillStyle; // Text color
    ctx.fillRect(turret4.x, turret4.y, turret4.w, turret4.h);

    // Turret 5
    const turret5 = Turret5(eTurretTargetDimensionsLocation.FOOTER);
    ctx.fillStyle = turret5.fillStyle; // Text color
    ctx.fillRect(turret5.x, turret5.y, turret5.w, turret5.h);

    // Turret 6
    const turret6 = Turret6(eTurretTargetDimensionsLocation.FOOTER);
    ctx.fillStyle = turret6.fillStyle; // Text color
    ctx.fillRect(turret6.x, turret6.y, turret6.w, turret6.h);

    // Draw turrets in footer
    ctx.fillStyle = gameState.selectedTurret.fillStyle; // Text color
    ctx.fillRect(OneThird * 2, 0, OneThird, levelBarHeight);
    const centerAlign = OneThird * 2 + OneThird / 2
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = 'bold 3em Arial';
    ctx.fillStyle = 'rgb(255,255,255)'; // Text color

    wrapText(ctx, "Damage: " + formatNumber(gameState.selectedTurret.damage) + "; Range: "
        + gameState.selectedTurret.range + "; Cost: " + formatNumber(gameState.selectedTurret.cost)
        + ";  W: " + gameState.selectedTurret.w + "; H:" + gameState.selectedTurret.h, centerAlign, levelBarHeight * .2, OneThird, 60);

    ctx.restore();

}


export function handleFooterClick(gameState: tGameState, click: tGridPosition) {

    const {x, y} = click;

    const footerHeight = GameFooterHeight();

    let footerOffset = window.innerHeight - footerHeight;

    console.log('Clicked on the footer');

    const checkTurretClicked = (turretCallable: tTurretCallable) => {

        const turret = turretCallable(eTurretTargetDimensionsLocation.FOOTER);

        turret.y += footerOffset;

        if (x > turret.x && x < turret.x + turret.w && y > turret.y && y < turret.y + turret.h) {

            gameState.selectedTurret = turretCallable(eTurretTargetDimensionsLocation.GAME);

            return true;

        }

        return false;
    }

    // determine which button was clicked

    if (checkTurretClicked(Turret1)
        || checkTurretClicked(Turret2)
        || checkTurretClicked(Turret3)
        || checkTurretClicked(Turret4)
        || checkTurretClicked(Turret5)
        || checkTurretClicked(Turret6)
    ) {

        console.log('Turret in footer was clicked')

        return;

    }

    return;

}