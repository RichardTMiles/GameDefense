import GameDefense from "./GameDefense.ts";
import {dictionary} from "./Dictionary";
import {formatNumber} from "./Header";
import {
    eTurretTargetDimensionsLocation,
    tTurretCallable,
    Turret1,
    Turret2,
    Turret3,
    Turret4,
    Turret5,
    Turret6,
} from "./Turrets";

import tGridPosition from "./tGridPosition";
import GameBodyHeight from "./BodyHeight";
import GameHeaderHeight from "./HeaderHeight";
import {tGameState} from "./InitialState";


export const footerLevelBarHeight = () => GameFooterHeight() * .5;
export const turretSectionHeight = () => GameFooterHeight() * .5;

export function GameFooterHeight() {
    return GameDefense.canvas.height * .25;
} // Example height for the footer


export const OneThirdFooter = () => GameDefense.canvas.width / 3;
export const OneHalfFooter = () => GameDefense.canvas.width / 2;

export default function Footer(ctx: CanvasRenderingContext2D, gameState: tGameState) {

    ctx.save();

    // Translate the context for horizontal scrolling of the game grid
    ctx.translate(0, GameHeaderHeight() + GameBodyHeight());

    const footerHeight = GameFooterHeight();

    // Draw the footer background
    ctx.fillStyle = 'rgba(98,74,74,0.37)'; // Assuming a dark background for the footer

    ctx.fillRect(0, 0, GameDefense.canvas.width, footerHeight);

    // Draw the level background
    ctx.fillStyle = 'rgba(172,39,192,0.46)'; // Assuming a dark background for the footer

    ctx.fillRect(0, 0, GameDefense.canvas.width, footerLevelBarHeight());

    const fullDictionary = dictionary();

    const allLevels = Object.keys(fullDictionary);

    const levelBarHeight = footerLevelBarHeight();

    const oneThird = OneThirdFooter();

    const oneHalf = OneHalfFooter();

    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = 'bold 1.5em Arial';

    // Draw the buttons
    allLevels.forEach((button, index) => {

        if (10 < Math.abs(gameState.level - index + 1)) {

            return

        }

        const x = (oneThird / 2 * index) - (oneThird / 2 * (gameState.level - 1));

        const buttonActive = (index + 1) === gameState.level;

        ctx.fillStyle = buttonActive ? '#64c027' : '#ac27c0';

        ctx.fillRect(x, 0, GameDefense.canvas.width / 6, levelBarHeight);

        ctx.fillStyle = 'rgb(255,255,255)'; // Text color

        ctx.fillText(button, x + GameDefense.canvas.width / 12, levelBarHeight / 2, GameDefense.canvas.width / 6 - (GameDefense.canvas.width / 6 * .1));

    });

    const selectedTurret = gameState.hoveredTurret ?? gameState.selectedTurret;

    // Turret Damage info
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = 'bold 1.5em Arial';
    ctx.fillStyle = selectedTurret.fillStyle; // Text color
    ctx.fillRect(oneHalf, 0, oneHalf, levelBarHeight);
    ctx.fillStyle = 'rgb(255,255,255)'; // Text color

    selectedTurret.level ??= 1

    const nextUpgrade = selectedTurret.upgrades[selectedTurret.level - 1]


    ctx.fillText(
        "Cost: " + formatNumber(selectedTurret.cost)
        + "; Damage: " + formatNumber(selectedTurret.damage)
        + "; Range: " + selectedTurret.range
        + "; Speed: " + selectedTurret.speed
        + "; Cooldown: " + selectedTurret.cooldown
        + "; W: " + selectedTurret.w
        + "; H: " + selectedTurret.h
        + "; Level: " + selectedTurret.level,
        oneHalf + oneHalf / 2,
        levelBarHeight * .25,
        oneHalf - (oneHalf * .1)
    );

    if (undefined !== nextUpgrade) {

        ctx.fillText("Upgrade = { Cost " + formatNumber(nextUpgrade.cost)
            + ", Damage " + formatNumber(nextUpgrade.damage)
            + ", Range " + nextUpgrade.range
            + ", Speed " + nextUpgrade.speed
            + ", Cooldown " + nextUpgrade.cooldown
            + ' }',
            oneHalf + oneHalf / 2,
            levelBarHeight * .75,
            oneHalf - (oneHalf * .1)
        );

    }

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