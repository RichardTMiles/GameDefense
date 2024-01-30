const canvas = document.getElementById('gameCanvas');

const ctx = canvas.getContext('2d');

let offsetX = 0; // This will be used to scroll the grid horizontally

// Create the game grid array
// 0: path, 1: wall, 2: player space, 3: orb
const gameGrid = [
    // Row 1
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 2, 2, 2, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 2, 2, 2, 2, 2, 2, 2, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 2, 2, 2, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 2, 2, 2, 2, 2, 2, 2, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 2, 2, 2, 2, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 2, 2, 2, 2, 2, 2, 2, 1],
    [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 0, 0, 0, 1, 2, 2, 2, 2, 2, 1, 0, 0, 0, 1, 2, 2, 2, 2, 2, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 2, 2, 2, 2, 2, 2, 2, 2, 1],
    [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 0, 0, 0, 1, 2, 2, 2, 2, 2, 1, 0, 0, 0, 1, 2, 2, 2, 2, 2, 1, 0, 0, 0, 1, 2, 2, 2, 2, 2, 1, 0, 0, 0, 1, 2, 2, 2, 2, 2, 2, 2, 2, 1],
    [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 0, 0, 0, 1, 2, 2, 2, 2, 2, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 2, 2, 2, 2, 2, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 0, 0, 0, 1, 2, 2, 2, 2, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 2, 2, 2, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 0, 0, 0, 1, 2, 2, 2, 2, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 2, 2, 2, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 2, 2, 2, 2, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 2, 2, 2, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 2, 2, 2, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 2, 2, 2, 2, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 2, 2, 2, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 2, 2, 2, 2, 1, 0, 0, 0, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 2, 2, 2, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 2, 2, 2, 2, 1, 0, 0, 0, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 1],
    [1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 2, 2, 2, 2, 2, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 1, 0, 0, 0, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 1],
    [1, 2, 2, 2, 2, 2, 1, 0, 0, 0, 1, 2, 2, 2, 2, 2, 1, 0, 0, 0, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 0, 0, 0, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 1],
    [1, 2, 2, 2, 2, 2, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 0, 0, 0, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 1],
    [1, 2, 2, 2, 2, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 1, 2, 2, 2, 2, 1],
    [1, 2, 2, 2, 2, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 2, 2, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 2, 2, 2, 2, 1],
    [1, 2, 2, 2, 2, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 2, 2, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 2, 2, 2, 2, 1],
    [1, 2, 2, 2, 2, 2, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 2, 2, 2, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 2, 2, 2, 2, 1],
    [1, 2, 2, 2, 2, 2, 1, 0, 0, 0, 1, 2, 2, 2, 2, 2, 1, 0, 0, 0, 1, 2, 2, 2, 2, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 1, 2, 2, 2, 2, 1],
    [1, 2, 2, 2, 2, 2, 1, 0, 0, 0, 1, 2, 2, 2, 2, 2, 1, 0, 0, 0, 1, 2, 2, 2, 2, 1, 0, 0, 0, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 1],
    [1, 2, 2, 2, 2, 2, 1, 0, 0, 0, 1, 2, 2, 2, 2, 2, 1, 0, 0, 0, 1, 2, 2, 2, 2, 1, 0, 0, 0, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 1],
    [1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 2, 2, 2, 2, 2, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 2, 2, 2, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 2, 2, 2, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 2, 2, 2, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 2, 2, 2, 2, 1],
    [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 0, 0, 0, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 2, 2, 2, 2, 1],
    [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 0, 0, 0, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 2, 2, 2, 2, 1],
    [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 0, 0, 0, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 2, 2, 2, 2, 2, 1],
    [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 0, 0, 0, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 0, 0, 0, 1, 2, 2, 2, 2, 2, 1, 0, 0, 0, 1, 2, 2, 2, 2, 2, 1],
    [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 0, 0, 0, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 0, 0, 0, 1, 2, 2, 2, 2, 2, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 2, 2, 2, 2, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 2, 2, 2, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 2, 2, 2, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
];

console.log(gameGrid[0].length);

// Define the positions of the orbs
// If you have specific positions for the orbs, you can put them in an array like this:
const orbs = [
    {x: 60, y: 17}, // Example orb position at grid cell (15, 4)
    // ... Add more orb positions as needed
];


// Game state
const gameState = {
    level: 4,
    time: 25,
    energy: 8,
    score: 631,
    turrets: [], // This will hold turret objects with x, y, and type properties
};

// Drag and drop state
const dragDropState = {
    selectedTurret: null,
    dragging: false,
    mouseX: 0,
    mouseY: 0,
};

const borderWidth = 1; // You can adjust the thickness of the border here


// Function to create a radial gradient for orbs
function createOrbGradient(ctx, x, y, radius) {

    // Create a radial gradient (inner circle to outer circle)
    let gradient = ctx.createRadialGradient(x, y, radius * 0.5, x, y, radius);

    // Add color stops
    gradient.addColorStop(0, 'rgb(172,39,192)'); // white center

    gradient.addColorStop(1, 'rgba(39, 66, 66, .8)'); // fading to transparent

    return gradient;

}


const getHeaderHeight = () => window.innerHeight * .10; // Example height for the header

const getFooterHeight = () => window.innerHeight * .3; // Example height for the footer

const getBodyHeight = () => window.innerHeight - (getHeaderHeight() + getFooterHeight());

console.log('ih', window.innerHeight, 'hh', getHeaderHeight(), 'fh', getFooterHeight(), 'bh', getBodyHeight());

const getCellSize = () => (window.innerHeight - getHeaderHeight() - getFooterHeight()) / gameGrid.length;


// Footer Levels
const getFooterButtons = () => [
    {x: 0, y: 10, width: 50, height: 20, text: 'NORMO', color: '#666'},
    {x: 50, y: 10, width: 50, height: 20, text: 'NORMO', color: '#666'},
    {x: 100, y: 10, width: 50, height: 20, text: 'SWARMO', color: '#666'},
    {x: 150, y: 10, width: 50, height: 20, text: 'NORMO', color: '#666'},
    {x: 200, y: 10, width: 50, height: 20, text: 'ZOOMO', color: '#666'},
    {x: 250, y: 10, width: 50, height: 20, text: 'NORMO', color: '#666'},
    {x: 300, y: 10, width: 50, height: 20, text: 'TOUGHO', color: '#666'},
    {x: 350, y: 10, width: 50, height: 20, text: 'NORMO', color: '#666'},
    {x: 400, y: 10, width: 50, height: 20, text: 'FLYBO', color: '#666'},
    {x: 450, y: 10, width: 50, height: 20, text: 'NORMO', color: '#666'},
    {x: 500, y: 10, width: 50, height: 20, text: "NORMOBOSS", color: '#666'},
    {x: 550, y: 10, width: 50, height: 20, text: "NORMO", color: '#666'},
    {x: 600, y: 10, width: 50, height: 20, text: "BOMBO", color: '#666'},
    {x: 650, y: 10, width: 50, height: 20, text: "NORMO", color: '#666'},
    {x: 700, y: 10, width: 50, height: 20, text: 'SWARMO', color: '#666'},
    {x: 750, y: 10, width: 50, height: 20, text: 'SWARMOBOSS', color: '#666'},
    {x: 800, y: 10, width: 50, height: 20, text: 'NORMO', color: '#666'},
    {x: 850, y: 10, width: 50, height: 20, text: 'ZOOMO', color: '#666'},
    {x: 900, y: 10, width: 50, height: 20, text: 'NORMO', color: '#666'},
    {x: 950, y: 10, width: 50, height: 20, text: 'FLYBO', color: '#666'},
    {x: 1000, y: 10, width: 50, height: 20, text: 'NORMO', color: '#666'},
    {x: 1050, y: 10, width: 50, height: 20, text: 'BOMBO', color: '#666'},
    {x: 1100, y: 10, width: 50, height: 20, text: 'NORMO', color: '#666'},
    {x: 1150, y: 10, width: 50, height: 20, text: 'TOUGHO', color: '#666'},
    {x: 1200, y: 10, width: 50, height: 20, text: 'ZOOMO', color: '#666'},
    {x: 1250, y: 10, width: 50, height: 20, text: 'ZOOMOBOSS', color: '#666'},
    {x: 1300, y: 10, width: 50, height: 20, text: 'NORMO', color: '#666'},
    {x: 1350, y: 10, width: 50, height: 20, text: 'SWARMO', color: '#666'},
    {x: 1400, y: 10, width: 50, height: 20, text: 'CHAMPO', color: '#666'},
    {x: 1450, y: 10, width: 50, height: 20, text: 'TOUGHOBOSS', color: '#666'},
    {x: 1500, y: 10, width: 50, height: 20, text: 'NORMO', color: '#666'},
    {x: 1550, y: 10, width: 50, height: 20, text: 'IRONO', color: '#666'},
    {x: 1650, y: 10, width: 50, height: 20, text: 'SWARMO', color: '#666'},
    {x: 1700, y: 10, width: 50, height: 20, text: 'NORMO', color: '#666'},
    {x: 1750, y: 10, width: 50, height: 20, text: 'ZOOMO', color: '#666'},
    {x: 1800, y: 10, width: 50, height: 20, text: 'NORMO', color: '#666'},
    {x: 1850, y: 10, width: 50, height: 20, text: 'TOUGHO', color: '#666'},
    {x: 1900, y: 10, width: 50, height: 20, text: 'FLYBO', color: '#666'},
    {x: 1950, y: 10, width: 50, height: 20, text: 'FLYBOBOSS', color: '#666'},
    {x: 2000, y: 10, width: 50, height: 20, text: 'NORMO', color: '#666'},
    {x: 2050, y: 10, width: 50, height: 20, text: 'CHAMPO', color: '#666'},
    {x: 2100, y: 10, width: 50, height: 20, text: 'BOMBO', color: '#666'},
    {x: 2150, y: 10, width: 50, height: 20, text: 'BOMBOBOSS', color: '#666'},
    {x: 2200, y: 10, width: 50, height: 20, text: 'NORMO', color: '#666'},
    {x: 2250, y: 10, width: 50, height: 20, text: 'IRONO', color: '#666'},
    {x: 2300, y: 10, width: 50, height: 20, text: 'BOMBO', color: '#666'},
    {x: 2350, y: 10, width: 50, height: 20, text: 'NORMO', color: '#666'},
    {x: 2400, y: 10, width: 50, height: 20, text: 'SWARMO', color: '#666'},
    {x: 2450, y: 10, width: 50, height: 20, text: 'CHAMPO', color: '#666'},
    {x: 2500, y: 10, width: 50, height: 20, text: 'NORMO', color: '#666'},
    {x: 2550, y: 10, width: 50, height: 20, text: 'IRONO', color: '#666'},
    {x: 2600, y: 10, width: 50, height: 20, text: 'IRONOBOSS', color: '#666'},
    {x: 2650, y: 10, width: 50, height: 20, text: 'NORMO', color: '#666'},
    {x: 2700, y: 10, width: 50, height: 20, text: 'SWARMO', color: '#666'},
    {x: 2750, y: 10, width: 50, height: 20, text: 'ZOOMO', color: '#666'},
    {x: 2800, y: 10, width: 50, height: 20, text: 'TOUGHO', color: '#666'},
    {x: 2850, y: 10, width: 50, height: 20, text: 'FLYBO', color: '#666'},
    {x: 2900, y: 10, width: 50, height: 20, text: 'BOMBO', color: '#666'},
    {x: 2950, y: 10, width: 50, height: 20, text: 'CHOMPO', color: '#666'},
    {x: 3000, y: 10, width: 50, height: 20, text: 'IRONO', color: '#666'},
    {x: 3050, y: 10, width: 50, height: 20, text: 'NORMO', color: '#666'},
    {x: 3100, y: 10, width: 50, height: 20, text: 'NORMO', color: '#666'},
    {x: 3150, y: 10, width: 50, height: 20, text: 'AWESOMEOBOSS', color: '#666'},
];

function drawFooter() {

    ctx.save();

    // Translate the context for horizontal scrolling of the game grid
    ctx.translate(0, getHeaderHeight() + getBodyHeight());

    // Draw the footer background
    ctx.fillStyle = 'rgba(98,74,74,0.37)'; // Assuming a dark background for the footer

    ctx.fillRect(0, 0, canvas.width, getFooterHeight());

    // Draw the buttons
    getFooterButtons().forEach(button => {

        ctx.fillStyle = button.color;

        ctx.fillRect(button.x, button.y, button.width, button.height);

        ctx.fillStyle = '#fff'; // Text color

        ctx.textAlign = 'center';

        ctx.textBaseline = 'middle';

        ctx.font = 'bold 8px Arial';

        ctx.fillText(button.text, button.x + button.width / 2, button.y + button.height / 2);

    });

    // Draw other footer elements like game stats
    // ...

    // You can also add images/icons by loading them and drawing them onto the canvas
    // ...

    ctx.restore();

}


// Add event listener for interaction with the footer buttons
canvas.addEventListener('click', (event) => {

    // Calculate the click position relative to the canvas
    const rect = canvas.getBoundingClientRect();

    const clickX = event.clientX - rect.left;

    const clickY = event.clientY - rect.top;

    const footerY = canvas.height - getFooterHeight(); // Y position of the footer

    // Check if the click is within the footer area
    if (clickY > footerY) {

        // Determine which button was clicked
        getFooterButtons().forEach(button => {
            if (
                clickX >= button.x &&
                clickX <= button.x + button.width &&
                clickY >= button.y &&
                clickY <= button.y + button.height
            ) {
                // Handle button click
                console.log(`Button ${button.text} was clicked.`);
            }
        });

    }

});

// Game rendering function
function renderGame() {

    // Clear the entire canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Save the current context state (with no translations)
    ctx.save();

    canvas.height = window.innerHeight;
    canvas.width = window.innerWidth;

    const headerHeight = getHeaderHeight(); // Example height for the header

    const footerHeight = getFooterHeight(); // Example height for the footer

    // Define the game grid dimensions
    // Define the size of each cell
    const cellSize = getCellSize();

    // Draw header
    ctx.fillStyle = '#444'; // Dark gray background for header

    ctx.fillRect(0, 0, canvas.width, headerHeight);

    // Add text for level info
    ctx.fillStyle = '#fff'; // White text

    ctx.font = '20px Arial';

    ctx.fillText(`Wave: ${gameState.level}`, 20, 30);

    ctx.fillText(`Time: ${gameState.time}`, 120, 30);

    ctx.fillText(`Energy: ${gameState.energy}`, 220, 30);

    ctx.fillText(`Score: ${gameState.score}`, 320, 30);

    // draw footer
    drawFooter();

    // Draw turrets in footer
    // ... (Your logic to draw turret selection icons)


    // Translate the context for horizontal scrolling of the game grid
    ctx.translate(-offsetX, headerHeight);

    const orbRadius = cellSize * 4; // You can adjust the radius of the orbs here

    for (let y = 0; y < gameGrid.length; y++) {

        for (let x = 0; x < gameGrid[y].length; x++) {

            const cellX = x * cellSize;

            const cellY = y * cellSize;

            // Paths are not drawn as they are the default background
            switch (gameGrid[y][x]) {
                case 0:
                    // Draw path
                    ctx.fillStyle = 'rgba(98,74,74,0.37)'; // Black
                    ctx.fillRect(cellX, cellY, cellSize, cellSize);
                    break;
                case 1:
                    // Draw wall
                    ctx.fillStyle = '#FF00FF'; // Purple
                    ctx.fillRect(cellX, cellY, cellSize, cellSize);
                    break;
                case 2:
                    // Draw wall
                    ctx.fillStyle = '#31b0c3'; // Purple
                    ctx.fillRect(cellX, cellY, cellSize, cellSize);
                    break;
                case 3:
                    // Draw orb
                    ctx.fillStyle = '#d30505'; // Black
                    ctx.fillRect(cellX, cellY, cellSize, cellSize);
                    ctx.fillStyle = '#27c02a';
                    ctx.beginPath();
                    ctx.arc((cellX) + (cellSize / 2), (cellY) + (cellSize / 2), cellSize / 3, 0, Math.PI * 2);
                    ctx.fill();
                    break;
            }

            // Draw the border around the cell
            ctx.strokeStyle = 'rgba(15,15,15,0.23)'; // Black color for the border

            ctx.lineWidth = borderWidth;

            ctx.strokeRect(cellX + borderWidth / 2, cellY + borderWidth / 2, cellSize - borderWidth, cellSize - borderWidth);

        }

    }

    // Draw the orbs on top of the grid
    orbs.forEach(orb => {

        // Calculate the orb's position, adjust by offsetX for horizontal scrolling
        const orbX = orb.x * cellSize - cellSize / 2;

        const orbY = orb.y * cellSize;

        // Draw the orb
        ctx.fillStyle = createOrbGradient(ctx, orbX, orbY, orbRadius); // Set the orb color

        ctx.beginPath();

        ctx.arc(orbX, orbY, orbRadius, 0, Math.PI * 2);

        ctx.fill();

    });

}


// Scroll function to update offsetX
function scrollGrid(amount) {

    offsetX += amount;

    // Optionally add limits to prevent scrolling too far left or right
    offsetX = Math.max(0, Math.min(offsetX, getCellSize() * gameGrid[0].length - window.innerWidth));

    renderGame();

}

canvas.addEventListener('wheel', function (event) {

    // Prevent the default scroll behavior and scroll the game grid instead
    event.preventDefault();

    // Use event.deltaY for vertical mouse wheel event to scroll horizontally
    if (event.deltaX > 0) {

        scrollGrid(event.deltaX); // Scroll right

    } else {

        scrollGrid(event.deltaX); // Scroll left

    }

});

// Main game loop
function gameLoop() {

    // Render the game
    renderGame();

    // Call the next frame
    //requestAnimationFrame(gameLoop);

}

// Start the game loop
gameLoop();