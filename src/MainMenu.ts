// Assume these imports at the top
import GenerateRandomRGBA from "./GenerateRandomRGBA";
import Particle, {Point} from "./Particle";
import {handleIEntity} from "./Entity";
import canvas from "./Canvas";
import {getGameState, startNewGame} from "./GameDefense";
import {eGameDisplayState, tGameState} from "./InitialState";


enum eMenuItem {
    START_GAME_DEFENSE,
    TUTORIAL,
    //OPTIONS,
    SOURCE_CODE,
    ISSUES,
}

interface iMenuItem {
    [key: number]: string;
}

const menuItems: iMenuItem = {
    [eMenuItem.START_GAME_DEFENSE]: 'Play Game Defense',
    [eMenuItem.TUTORIAL]: 'Tutorial',
    //[eMenuItem.OPTIONS]: 'Options',
    [eMenuItem.SOURCE_CODE]: 'Source Code',
    [eMenuItem.ISSUES]: 'Report Issue'
};


// Helper function to create menu items with boundaries
function menuItemPositions(canvas: HTMLCanvasElement) {
    const menuItemHeight = 50;
    const menuItemNames = Object.values(menuItems);
    const menuStartY = (canvas.height - (menuItemNames.length * menuItemHeight)) / 2;

    return menuItemNames.map((item, index) => {
        const y = menuStartY + index * menuItemHeight;
        return {
            text: item,
            x: canvas.width / 2 - 100, // Assuming a width of 200px for each menu item for simplicity
            y: y,
            width: 200,
            height: menuItemHeight,
        };
    });
}

// Function to check if a click is within a menu item's boundaries
function isClickInsideMenuItem(mouseX: number, mouseY: number, menuItem: any) {
    return (
        mouseX >= menuItem.x &&
        mouseX <= menuItem.x + menuItem.width &&
        mouseY >= menuItem.y &&
        mouseY <= menuItem.y + menuItem.height
    );
}

let hoveredItem: string | null = null;

export default function MainMenu(gameState: tGameState) {
    const ctx = gameState.context;
    const canvas = ctx.canvas;
    const menuItems = menuItemPositions(canvas);

    ctx.font = '24px Arial';
    ctx.textAlign = 'center';

    gameState.particles = gameState.particles.filter(particle => handleIEntity(particle));

    menuItems.forEach((item) => {

        if (Math.random() > .9) {
            const x = item.x + item.width / 2
            const y = item.y + item.height / 2
            const randomX = Math.random() * canvas.width;
            const randomY = Math.random() * canvas.height;

            gameState.particles.push(new Particle({
                start: {
                    x: x,
                    y: y,
                },
                control: Math.random() > .5 ? {
                    x: x,
                    y: randomY
                } : {
                    x: randomX,
                    y: y
                },
                end: {
                    x: randomX,
                    y: randomY
                },
                fillStyle: GenerateRandomRGBA(),
                gameState: gameState,
            }))
        }

        ctx.fillStyle = item.text === hoveredItem ? 'red' : 'white';

        ctx.fillText(item.text, item.x + item.width / 2, item.y + item.height / 2);

    });

}

function getMenuXY(e: MouseEvent, gameState: tGameState) {
    const ctx = gameState.context;
    const canvas = ctx.canvas;
    const menuItems = menuItemPositions(canvas);
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    return {mouseX, mouseY, menuItems};
}


// Add event listener for clicks
const onClick = (e: MouseEvent) => {
    const gameState = getGameState();

    if (gameState.gameDisplayState !== eGameDisplayState.MAIN_MENU) {
        return;
    }

    const {mouseX, mouseY, menuItems} = getMenuXY(e, gameState);

    menuItems.forEach((item) => {

        if (isClickInsideMenuItem(mouseX, mouseY, item)) {
            console.log(`${item.text} was clicked `, menuItems[eMenuItem.START_GAME_DEFENSE]);

            // Remove the event listener to prevent memory leaks
            const removeEvent = () => canvas.removeEventListener('click', onClick);

            switch (item.text) {
                case menuItems[eMenuItem.START_GAME_DEFENSE].text:
                    startNewGame()
                    removeEvent();
                    break;
                case menuItems[eMenuItem.SOURCE_CODE].text:
                    window.open('https://github.com/RichardTMiles/GameDefense', '_blank');
                    break;
                case menuItems[eMenuItem.ISSUES].text:
                    window.open('https://github.com/RichardTMiles/GameDefense/issues', '_blank');
                    break;
                case menuItems[eMenuItem.TUTORIAL].text:
                    window.open('https://github.com/RichardTMiles/GameDefense/blob/main/README.md', '_blank');
                    break;
            }
        }
    });
};

canvas.addEventListener('click', onClick);


const onMouseMove = (e: MouseEvent) => {
    const gameState = getGameState();

    if (gameState.gameDisplayState !== eGameDisplayState.MAIN_MENU) {
        return;
    }

    const {mouseX, mouseY, menuItems} = getMenuXY(e, gameState);

    hoveredItem = null;

    menuItems.forEach((item) => {
        if (isClickInsideMenuItem(mouseX, mouseY, item)) {
            hoveredItem = item.text;
        }
    });
};

canvas.addEventListener('mousemove', onMouseMove);