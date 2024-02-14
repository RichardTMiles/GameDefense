import {iTurret} from "./Turret";
import canvas from "./Canvas";
import {footerLevelBarHeight, turretSectionHeight} from "./Footer";


interface iTurretUpgrade {
    cost: number;
    range: number;
    damage: number;
    cooldown: number;
    speed: number;
}



export enum eTurretTargetType {
    OLDEST,
    NEWEST,
    CLOSEST,
}


export enum eTurretTargetDimensionsLocation {
    GAME,
    FOOTER
}

export enum eTurretTargetDimensionsType {

}

export type tTurretCallable = (location: eTurretTargetDimensionsLocation) => iTurret;


export const Turret1: tTurretCallable = (location: eTurretTargetDimensionsLocation): iTurret => {
    const forGame = location === eTurretTargetDimensionsLocation.GAME;

    return {
        x: 0,
        y: footerLevelBarHeight(),
        w: forGame ? 1 : canvas.width / 6,
        h: forGame ? 1 : turretSectionHeight(),
        fillStyle: 'rgba(0,0,0,1)',
        range: 8,
        damage: 50,
        cooldown: 9,
        cost: 500,
        speed: 0.5,
        upgrades: [
            {
                cost: 10000,
                range: 12,
                damage: 500,
                cooldown: 8,
                speed: 1
            },
            {
                cost: 100000,
                range: 15,
                damage: 2000,
                cooldown: 7,
                speed: 2
            }
        ]
    }
}

export const Turret2: tTurretCallable = (location: eTurretTargetDimensionsLocation): iTurret => {
    const OneSixth = canvas.width / 6;
    const forGame = location === eTurretTargetDimensionsLocation.GAME;
    return {
        x: OneSixth,
        y: footerLevelBarHeight(),
        w: forGame ? 2 : OneSixth,
        h: forGame ? 2 : turretSectionHeight(),
        fillStyle: 'rgb(211,5,5)',
        range: 12,
        damage: 300,
        cooldown: 7,
        cost: 5e4,
        speed: 0.75,
        upgrades: [
            {
                cost: 600,
                range: 14,
                damage: 200,
                cooldown: 6,
                speed: 1
            },
            {
                cost: 1200,
                range: 16,
                damage: 400,
                cooldown: 5,
                speed: 2
            }
        ]
    }
}

export const Turret3: tTurretCallable = (location: eTurretTargetDimensionsLocation): iTurret => {
    const OneSixth = canvas.width / 6;
    const forGame = location === eTurretTargetDimensionsLocation.GAME;
    return {
        x: OneSixth + OneSixth,
        y: footerLevelBarHeight(),
        w: forGame ? 3 : OneSixth,
        h: forGame ? 2 : turretSectionHeight(),
        fillStyle: 'rgb(192,172,39)',
        range: 15,
        damage: 200,
        cooldown: 8,
        cost: 1e6,
        speed: 1,
        upgrades: [
            {
                cost: 2000,
                range: 17,
                damage: 400,
                cooldown: 7,
                speed: 1
            },
            {
                cost: 4000,
                range: 19,
                damage: 800,
                cooldown: 6,
                speed: 2
            }
        ]
    }
}

export const Turret4: tTurretCallable = (location: eTurretTargetDimensionsLocation): iTurret => {
    const OneSixth = canvas.width / 6;
    const forGame = location === eTurretTargetDimensionsLocation.GAME;
    return {
        x: OneSixth + 2 * OneSixth,
        y: footerLevelBarHeight(),
        w: forGame ? 3 : OneSixth,
        h: forGame ? 3 : turretSectionHeight(),
        fillStyle: 'rgb(157,156,156)',
        range: 17,
        damage: 1000,
        cooldown: 20,
        cost: 4e8,
        speed: 2,
        upgrades: [
            {
                cost: 4e9,
                range: 20,
                damage: 2000,
                cooldown: 15,
                speed: 1
            },
            {
                cost: 4e10,
                range: 25,
                damage: 4000,
                cooldown: 10,
                speed: 2
            }
        ]
    }
}

export const Turret5: tTurretCallable = (location: eTurretTargetDimensionsLocation): iTurret => {
    const OneSixth = canvas.width / 6;
    const forGame = location === eTurretTargetDimensionsLocation.GAME;
    return {
        x: OneSixth + 3 * OneSixth,
        y: footerLevelBarHeight(),
        w: forGame ? 4 : OneSixth,
        h: forGame ? 4 : turretSectionHeight(),
        fillStyle: 'rgb(0,207,250)',
        range: 22,
        damage: 2000,
        cooldown: 3,
        cost: 5e10,
        speed: 1,
        upgrades: [
            {
                cost: 80000,
                range: 25,
                damage: 4000,
                cooldown: 2,
                speed: 1
            },
            {
                cost: 160000,
                range: 30,
                damage: 8000,
                cooldown: 1,
                speed: 2
            }
        ]
    }

}

export const Turret6: tTurretCallable = (location: eTurretTargetDimensionsLocation): iTurret => {
    const OneSixth = canvas.width / 6;
    const forGame = location === eTurretTargetDimensionsLocation.GAME;
    return {
        x: OneSixth + 4 * OneSixth,
        y: footerLevelBarHeight(),
        w: forGame ? 5 : OneSixth,
        h: forGame ? 5 : turretSectionHeight(),
        fillStyle: 'rgb(232,122,54)',
        range: 30,
        damage: 1e6,
        cooldown: 0,
        cost: 6e12,
        speed: 1,
        upgrades: [
            {
                cost: 6e14,
                range: 35,
                damage: 6e6,
                cooldown: 0,
                speed: 5
            },
            {
                cost: 6e16,
                range: 40,
                damage: 8e6,
                cooldown: 0,
                speed: 10
            }
        ]
    }
}


