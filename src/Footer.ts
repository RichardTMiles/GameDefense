import {iTurret} from "./Turret";
import tGridPosition from "./tGridPosition";
import GameBodyHeight from "./BodyHeight";
import canvas from "./Canvas";
import GameHeaderHeight from "./HeaderHeight";
import {tGameState} from "./InitialState";


// Footer Levels
const getFooterButtons: string[] = [
    'NORMO', 'NORMO', 'SWARMO', 'NORMO', 'ZOOMO', 'NORMO', 'TOUGHO', 'NORMO', 'FLYBO', 'NORMO', "NORMO BOSS", "NORMO",
    "BOMBO", "NORMO", 'SWARMO', 'SWARMO BOSS', 'NORMO', 'ZOOMO', 'NORMO', 'FLYBO', 'NORMO', 'BOMBO', 'NORMO', 'TOUGHO',
    'ZOOMO', 'ZOOMO BOSS', 'NORMO', 'SWARMO', 'CHAMPO', 'TOUGHO BOSS', 'NORMO', 'IRONO', 'SWARMO', 'NORMO', 'ZOOMO', 'NORMO',
    'TOUGHO', 'FLYBO', 'FLYBO BOSS', 'NORMO', 'CHAMPO', 'BOMBO', 'BOMBO BOSS', 'NORMO', 'IRONO', 'BOMBO', 'NORMO', 'SWARMO',
    'CHAMPO', 'NORMO', 'IRONO', 'IRONO BOSS', 'NORMO', 'SWARMO', 'ZOOMO', 'TOUGHO', 'FLYBO', 'BOMBO', 'CHOMPO', 'IRONO',
    'NORMO', 'NORMO', 'AWESOMEO BOSS',
];

const footerLevelBarHeight = () => GameFooterHeight() * .15;
const turretSectionHeight = () => GameFooterHeight() * .85;

export function GameFooterHeight() {
    return window.innerHeight * .25;
} // Example height for the footer


const OneThirdFooter = () => canvas.width / 3;

export interface iTurretInfo extends tGridPosition, iTurret {
    w: number,
    h: number,
    fillStyle: string
}

export const Turret1 = (): iTurretInfo => {
    const OneThird = OneThirdFooter();
    return {
        x: OneThird + OneThird / 6,
        y: footerLevelBarHeight() + turretSectionHeight() * .3,
        w: OneThird / 8,
        h: OneThird / 8,
        fillStyle: 'rgb(39,192,42)',
        range: 5,
        damage: 10,
        cooldown: 10,
        cost: 10
    }
}

export const Turret2 = (): iTurretInfo => {
    const OneThird = OneThirdFooter();
    return {
        x: OneThird + OneThird / 6,
        y: footerLevelBarHeight() + turretSectionHeight() * .6,
        w: OneThird / 8,
        h: OneThird / 8,
        fillStyle: 'rgb(211,5,5)',
        range: 10,
        damage: 100,
        cooldown: 9,
        cost: 100
    }

}

export const Turret3 = (): iTurretInfo => {
    const OneThird = OneThirdFooter();
    return {
        x: OneThird + 2 * OneThird / 6,
        y: footerLevelBarHeight() + turretSectionHeight() * .3,
        w: OneThird / 8,
        h: OneThird / 8,
        fillStyle: 'rgb(192,172,39)',
        range: 5,
        damage: 200,
        cooldown: 8,
        cost: 1000
    }
}

export const Turret4 = (): iTurretInfo => {
    const OneThird = OneThirdFooter();
    return {
        x: OneThird + 2 * OneThird / 6,
        y: footerLevelBarHeight() + turretSectionHeight() * .6,
        w: OneThird / 8,
        h: OneThird / 8,
        fillStyle: 'rgb(157,156,156)',
        range: 30,
        damage: 10000,
        cooldown: 20,
        cost: 10000
    }
}

export const Turret5 = (): iTurretInfo => {
    const OneThird = OneThirdFooter();
    return {
        x: OneThird + 3 * OneThird / 6,
        y: footerLevelBarHeight() + turretSectionHeight() * .3,
        w: OneThird / 8,
        h: OneThird / 8,
        fillStyle: 'rgb(0,207,250)',
        range: 40,
        damage: 2000,
        cooldown: 3,
        cost: 20000
    }
}

export const Turret6 = (): iTurretInfo => {
    const OneThird = OneThirdFooter();
    return {
        x: OneThird + 3 * OneThird / 6,
        y: footerLevelBarHeight() + turretSectionHeight() * .6,
        w: OneThird / 8,
        h: OneThird / 8,
        fillStyle: 'rgb(232,122,54)',
        range: 50,
        damage: 10000,
        cooldown: 0,
        cost: 500000
    }
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

    // Draw the buttons
    getFooterButtons.forEach((button, index) => {

        const x = (canvas.width / 2) + (100 * index) - (100 * gameState.level);

        const buttonActive = (index + 1) === gameState.level;

        ctx.fillStyle = buttonActive ? '#64c027' : '#ac27c0';

        ctx.fillRect(x, 0, 99, footerLevelBarHeight());

        ctx.fillStyle = 'rgb(255,255,255)'; // Text color

        ctx.textAlign = 'center';

        ctx.textBaseline = 'middle';

        ctx.font = 'bold 14px Arial';

        ctx.fillText(button, x + 50, 23);

    });

    const OneThird = OneThirdFooter();

    // Draw other footer elements like game stats
    ctx.fillStyle = gameState.selectedTurret.fillStyle; // Text color
    ctx.fillRect(0, 0, OneThird, footerHeight);

    // You can also add images/icons by loading them and drawing them onto the canvas
    ctx.fillStyle = 'rgba(199,19,19,0.19)'; // Text color
    ctx.fillRect(OneThird, 0, OneThird, footerHeight);

    // Draw turrets in footer turret section
    ctx.fillStyle = 'rgba(19,82,199,0.56)'; // Text color
    ctx.fillRect(OneThird, footerLevelBarHeight(), OneThird, turretSectionHeight());

    // Turret 1
    const turret1 = Turret1();
    ctx.fillStyle = turret1.fillStyle; // Text color
    ctx.fillRect(turret1.x, turret1.y, turret1.w, turret1.h);

    // Turret 2
    const turret2 = Turret2();
    ctx.fillStyle = turret2.fillStyle; // Text color
    ctx.fillRect(turret2.x, turret2.y, turret2.w, turret2.h);

    // Turret 3
    const turret3 = Turret3();
    ctx.fillStyle = turret3.fillStyle; // Text color
    ctx.fillRect(turret3.x, turret3.y, turret3.w, turret3.h);

    // Turret 4
    const turret4 = Turret4();
    ctx.fillStyle = turret4.fillStyle; // Text color
    ctx.fillRect(turret4.x, turret4.y, turret4.w, turret4.h);

    // Turret 5
    const turret5 = Turret5();
    ctx.fillStyle = turret5.fillStyle; // Text color
    ctx.fillRect(turret5.x, turret5.y, turret5.w, turret5.h);

    // Turret 6
    const turret6 = Turret6();
    ctx.fillStyle = turret6.fillStyle; // Text color
    ctx.fillRect(turret6.x, turret6.y, turret6.w, turret6.h);

    // Draw turrets in footer
    ctx.fillStyle = 'rgba(157,156,156,0.41)'; // Text color
    ctx.fillRect(OneThird * 2, 0, OneThird, footerHeight);

    ctx.restore();

}


export function handleFooterClick(gameState: tGameState, click: tGridPosition) {

    const {x, y} = click;

    const footerHeight = GameFooterHeight();

    let footerOffset = window.innerHeight - footerHeight;

    console.log('Clicked on the footer');

    const checkTurretClicked = (turret: iTurretInfo) => {

        turret.y += footerOffset;

        if (x > turret.x && x < turret.x + turret.w && y > turret.y && y < turret.y + turret.h) {

            gameState.selectedTurret = turret;

            return true;

        }

        return false;
    }

    // determine which button was clicked
    const turretOne = Turret1()

    if (checkTurretClicked(turretOne)) {

        console.log('Turret 1 was clicked')

        return;

    }

    const turretTwo = Turret2()

    if (checkTurretClicked(turretTwo)) {

        console.log('Turret 2 was clicked')

        return;

    }

    const turretThree = Turret3()

    if (checkTurretClicked(turretThree)) {

        console.log('Turret 3 was clicked')

        return;

    }

    const turretFour = Turret4()

    if (checkTurretClicked(turretFour)) {

        console.log('Turret 4 was clicked')

        return;

    }

    const turretFive = Turret5()

    if (checkTurretClicked(turretFive)) {

        console.log('Turret 5 was clicked')

        return;

    }

    const turretSix = Turret6()

    if (checkTurretClicked(turretSix)) {

        console.log('Turret 6 was clicked')

        return;

    }

    return;

}