const canvas = document.getElementById('gameCanvas');

const ctx = canvas.getContext('2d');

let offsetX = 0; // This will be used to scroll the grid horizontally

// Create the game grid array
// 0: path, 1: wall, 2: player space, 3: orb
const gameGrid = [
    // Row 1
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 2, 2, 2, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 2, 2, 2, 2, 2, 2, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 2, 2, 2, 2, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 2, 2, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 2, 2, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 2, 2, 2, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 2, 2, 2, 2, 2, 2, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 2, 2, 2, 2, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 2, 2, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 2, 2, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 2, 2, 2, 2, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 2, 2, 2, 2, 2, 2, 2, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 2, 2, 2, 2, 2, 2, 1, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 1, 2, 2, 2, 2, 1, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 1, 2, 2, 2, 2, 1, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 1, 2, 2, 2, 2, 1, 1, 1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1],
    [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 0, 0, 0, 1, 2, 2, 2, 2, 2, 1, 0, 0, 0, 1, 2, 2, 2, 2, 2, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 2, 2, 2, 2, 2, 2, 2, 2, 1, 0, 0, 0, 1, 2, 2, 2, 2, 2, 1, 0, 0, 0, 1, 2, 2, 2, 2, 2, 1, 0, 0, 0, 1, 2, 2, 2, 2, 2, 2, 1, 0, 0, 0, 1, 2, 2, 2, 1, 0, 0, 0, 1, 2, 2, 2, 2, 1, 0, 0, 0, 1, 2, 2, 2, 1, 0, 0, 0, 1, 2, 2, 2, 2, 1, 0, 0, 0, 1, 2, 2, 2, 1, 0, 0, 0, 1, 2, 2, 2, 2, 1, 1, 1, 0, 0, 0, 0, 0, 1, 1, 2, 2, 2, 2, 1, 1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1],
    [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 0, 0, 0, 1, 2, 2, 2, 2, 2, 1, 0, 0, 0, 1, 2, 2, 2, 2, 2, 1, 0, 0, 0, 1, 2, 2, 2, 2, 2, 1, 0, 0, 0, 1, 2, 2, 2, 2, 2, 2, 2, 2, 1, 0, 0, 0, 1, 2, 2, 2, 2, 2, 1, 0, 0, 0, 1, 2, 2, 2, 2, 2, 1, 0, 0, 0, 1, 2, 2, 2, 2, 2, 2, 1, 0, 0, 0, 1, 2, 2, 2, 1, 0, 0, 0, 1, 2, 2, 2, 2, 1, 0, 0, 0, 1, 2, 2, 2, 1, 0, 0, 0, 1, 2, 2, 2, 2, 1, 0, 0, 0, 1, 2, 2, 2, 1, 0, 0, 0, 1, 2, 2, 2, 2, 1, 1, 1, 0, 0, 0, 0, 0, 1, 1, 2, 2, 2, 2, 1, 1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1],
    [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 0, 0, 0, 1, 2, 2, 2, 2, 2, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 2, 2, 2, 2, 2, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 2, 2, 2, 2, 2, 1, 0, 0, 0, 1, 2, 2, 2, 2, 2, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 2, 2, 2, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 2, 2, 2, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 2, 2, 2, 1, 0, 0, 0, 1, 2, 2, 2, 2, 1, 1, 1, 0, 0, 0, 0, 0, 1, 1, 2, 2, 2, 2, 1, 1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1],
    [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 0, 0, 0, 1, 2, 2, 2, 2, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 2, 2, 2, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 2, 2, 2, 2, 1, 0, 0, 0, 1, 2, 2, 2, 2, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 2, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 2, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 2, 2, 1, 0, 0, 0, 1, 2, 2, 2, 2, 1, 1, 1, 0, 0, 0, 0, 0, 1, 1, 2, 2, 2, 2, 1, 1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1],
    [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 0, 0, 0, 1, 2, 2, 2, 2, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 2, 2, 2, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 2, 2, 2, 2, 1, 0, 0, 0, 1, 2, 2, 2, 2, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 2, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 2, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 2, 2, 1, 0, 0, 0, 1, 2, 2, 2, 2, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 2, 2, 2, 2, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 2, 2, 2, 2, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 2, 2, 2, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 2, 2, 2, 2, 1, 0, 0, 0, 1, 2, 2, 2, 2, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 2, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 2, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 2, 2, 1, 0, 0, 0, 1, 2, 2, 2, 2, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 2, 2, 2, 2, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 2, 2, 2, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 2, 2, 2, 2, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 2, 2, 2, 2, 2, 1, 0, 0, 0, 1, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 2, 2, 2, 2, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 2, 2, 2, 2, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 2, 2, 2, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 2, 2, 2, 2, 1, 0, 0, 0, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 1, 0, 0, 0, 1, 2, 2, 2, 2, 2, 1, 0, 0, 0, 1, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 1, 0, 0, 0, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 2, 2, 2, 2, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 2, 2, 2, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 2, 2, 2, 2, 1, 0, 0, 0, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 1, 0, 0, 0, 1, 2, 2, 2, 2, 2, 1, 0, 0, 0, 1, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 1, 0, 0, 0, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 2, 2, 2, 2, 2, 2, 2, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 2, 2, 2, 2, 2, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 1, 0, 0, 0, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 1, 0, 0, 0, 1, 2, 2, 2, 2, 2, 1, 0, 0, 0, 1, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 1, 0, 0, 0, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 2, 2, 2, 2, 2, 2, 2, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1],
    [1, 2, 2, 2, 2, 2, 1, 0, 0, 0, 1, 2, 2, 2, 2, 2, 1, 0, 0, 0, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 0, 0, 0, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 1, 0, 0, 0, 1, 2, 2, 2, 2, 2, 1, 0, 0, 0, 1, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 1, 0, 0, 0, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 2, 2, 2, 2, 2, 2, 2, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1],
    [1, 2, 2, 2, 2, 2, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 0, 0, 0, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 1, 0, 0, 0, 1, 2, 2, 2, 2, 2, 1, 0, 0, 0, 1, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 1, 0, 0, 0, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1],
    [1, 2, 2, 2, 2, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 1, 2, 2, 2, 2, 1, 0, 0, 0, 1, 2, 2, 2, 2, 2, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 1, 2, 2, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1],
    [1, 2, 2, 2, 2, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 2, 2, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 2, 2, 2, 2, 1, 0, 0, 0, 1, 2, 2, 2, 2, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 2, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 2, 2, 2, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1],
    [1, 2, 2, 2, 2, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 2, 2, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 2, 2, 2, 2, 1, 0, 0, 0, 1, 2, 2, 2, 2, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 2, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 2, 2, 2, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1],
    [1, 2, 2, 2, 2, 2, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 2, 2, 2, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 2, 2, 2, 2, 1, 0, 0, 0, 1, 2, 2, 2, 2, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 2, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 2, 2, 2, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1],
    [1, 2, 2, 2, 2, 2, 1, 0, 0, 0, 1, 2, 2, 2, 2, 2, 1, 0, 0, 0, 1, 2, 2, 2, 2, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 1, 2, 2, 2, 2, 1, 0, 0, 0, 1, 2, 2, 2, 2, 2, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 1, 2, 2, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 2, 2, 2, 2, 2, 1, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1],
    [1, 2, 2, 2, 2, 2, 1, 0, 0, 0, 1, 2, 2, 2, 2, 2, 1, 0, 0, 0, 1, 2, 2, 2, 2, 1, 0, 0, 0, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 1, 0, 0, 0, 1, 2, 2, 2, 2, 2, 1, 0, 0, 0, 1, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 1, 0, 0, 0, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 0, 0, 0, 1, 2, 2, 2, 2, 2, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1],
    [1, 2, 2, 2, 2, 2, 1, 0, 0, 0, 1, 2, 2, 2, 2, 2, 1, 0, 0, 0, 1, 2, 2, 2, 2, 1, 0, 0, 0, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 1, 0, 0, 0, 1, 2, 2, 2, 2, 2, 1, 0, 0, 0, 1, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 1, 0, 0, 0, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 2, 2, 2, 2, 2, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 1, 0, 0, 0, 1, 2, 2, 2, 2, 2, 1, 0, 0, 0, 1, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 1, 0, 0, 0, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 2, 2, 2, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 1, 0, 0, 0, 1, 2, 2, 2, 2, 2, 1, 0, 0, 0, 1, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 1, 0, 0, 0, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 2, 2, 2, 2, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 2, 2, 2, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 1, 0, 0, 0, 1, 2, 2, 2, 2, 2, 1, 0, 0, 0, 1, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 1, 0, 0, 0, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 2, 2, 2, 2, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 2, 2, 2, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 2, 2, 2, 2, 2, 1, 0, 0, 0, 1, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 2, 2, 2, 2, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 2, 2, 2, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 2, 2, 2, 2, 1, 0, 0, 0, 1, 2, 2, 2, 2, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 0, 0, 0, 1, 2, 2, 2, 2, 2, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1],
    [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 0, 0, 0, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 2, 2, 2, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 2, 2, 2, 2, 1, 0, 0, 0, 1, 2, 2, 2, 2, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 0, 0, 0, 1, 2, 2, 2, 2, 2, 1, 0, 0, 0, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1],
    [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 0, 0, 0, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 2, 2, 2, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 2, 2, 2, 2, 1, 0, 0, 0, 1, 2, 2, 2, 2, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 0, 0, 0, 1, 2, 2, 2, 2, 2, 1, 0, 0, 0, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1],
    [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 0, 0, 0, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 2, 2, 2, 2, 2, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 2, 2, 2, 2, 2, 1, 0, 0, 0, 1, 2, 2, 2, 2, 2, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 0, 0, 0, 1, 2, 2, 2, 2, 2, 1, 0, 0, 0, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1],
    [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 0, 0, 0, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 0, 0, 0, 1, 2, 2, 2, 2, 2, 1, 0, 0, 0, 1, 2, 2, 2, 2, 2, 1, 0, 0, 0, 1, 2, 2, 2, 2, 2, 2, 2, 2, 1, 0, 0, 0, 1, 2, 2, 2, 2, 2, 1, 0, 0, 0, 1, 2, 2, 2, 2, 2, 1, 0, 0, 0, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 0, 0, 0, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 0, 0, 0, 1, 2, 2, 2, 2, 2, 1, 0, 0, 0, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1],
    [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 0, 0, 0, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 0, 0, 0, 1, 2, 2, 2, 2, 2, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 2, 2, 2, 2, 2, 2, 2, 2, 1, 0, 0, 0, 1, 2, 2, 2, 2, 2, 1, 0, 0, 0, 1, 2, 2, 2, 2, 2, 1, 0, 0, 0, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 0, 0, 0, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 0, 0, 0, 1, 2, 2, 2, 2, 2, 1, 0, 0, 0, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 2, 2, 2, 2, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 2, 2, 2, 2, 2, 2, 2, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 2, 2, 2, 2, 2, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 2, 2, 2, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 2, 2, 2, 2, 2, 2, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 2, 2, 2, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 2, 2, 2, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 2, 2, 2, 2, 2, 2, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 2, 2, 2, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
];

// Define the positions of the orbs
// If you have specific positions for the orbs
const orbs = [
    {x: 60, y: 17},
    {x: 93, y: 17},
    {x: 139, y: 17},
    {x: 156, y: 4},
    {x: 169, y: 4},
];

class Node {
    constructor(position, distance, parent = null) {
        this.position = position;
        this.distance = distance;
        this.parent = parent;
    }
}

function findNeighbors(node, grid) {
    const directions = [[1, 0], [0, 1], [-1, 0], [0, -1]]; // Right, Down, Left, Up
    const result = [];
    for (let dir of directions) {
        const neighborPos = {x: node.position.x + dir[0], y: node.position.y + dir[1]};
        if (neighborPos.x >= 0 && neighborPos.x < grid[0].length &&
            neighborPos.y >= 0 && neighborPos.y < grid.length &&
            grid[neighborPos.y][neighborPos.x] === 0) {
            result.push(new Node(neighborPos, node.distance + 1));
        }
    }
    return result;
}

function dijkstra(grid, start, end) {

    let startNode = new Node(start, 0);
    let endNode = new Node(end, Infinity);
    let unvisited = [startNode];
    let visited = new Set();

    while (unvisited.length > 0) {
        // Sort unvisited nodes by distance from the start node
        unvisited.sort((a, b) => a.distance - b.distance);

        let currentNode = unvisited.shift();

        // If we reach the end node, reconstruct and return the path
        if (currentNode.position.x === endNode.position.x && currentNode.position.y === endNode.position.y) {

            let path = [];

            let current = currentNode;

            while (current != null) {

                path.unshift(current.position);

                current = current.parent;

            }

            return path;

        }

        let id = `${currentNode.position.x}-${currentNode.position.y}`;

        if (visited.has(id)) {

            continue;

        }

        visited.add(id);

        let neighbors = findNeighbors(currentNode, grid);

        for (let neighbor of neighbors) {

            let neighborId = `${neighbor.position.x}-${neighbor.position.y}`;

            if (!visited.has(neighborId)) {

                neighbor.parent = currentNode; // Set the parent

                unvisited.push(neighbor);

            }

        }

    }

    return []; // Return an empty path if no path is found
}

let dijkstraCache = {};

function hashKeyForPath(start, end) {
    return `${start.x}-${start.y}_to_${end.x}-${end.y}`;
}

function getCachedPath(start, end) {
    const key = hashKeyForPath(start, end);
    return dijkstraCache[key];
}

function cachePath(start, end, path) {
    const key = hashKeyForPath(start, end);
    dijkstraCache[key] = path;
}

// Modified Dijkstra's algorithm that uses caching
function dijkstraWithCaching(grid, start, end) {

    // Check if the path is already in the cache
    const cachedPath = getCachedPath(start, end);

    if (cachedPath) {

        console.log('cachedPath', cachedPath);

        return cachedPath;

    }

    console.log('dijkstraWithCaching', start, end);
    console.trace()

    // Compute the path using Dijkstra's algorithm (not shown here for brevity)
    const path = dijkstra(grid, start, end);

    // Cache the computed path
    cachePath(start, end, path);

    return path;
}


// Define the start and end positions
const start = {x: 1, y: 1}; // Starting position
const end = orbs[0]; // Ending position (target)

// Game state
const gameState = {
    level: 1,
    processedLevel: 0,
    startTime: new Date(),
    energy: 0,
    score: 0,
    turrets: [], // This will hold turret objects with x, y, and type properties,
    monsters: [], // This will hold monster objects with x, y, and type properties,
    projectiles: [], // This will hold projectile objects with x, y, and type properties,
    spawners: [], // This will hold spawner objects to systematically spawn monsters
    status: 'playing', // playing, won, or lost
};

function secondsElapsed() {
    const endTime = new Date();

    let timeDiff = endTime - gameState.startTime; //in ms

    // strip the ms
    timeDiff /= 1000;

    // get seconds
    return Math.round(timeDiff);
}

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

    const clickX = event.clientX - rect.left

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

    const timeElapsed = secondsElapsed();

    ctx.fillText(`Time: ${timeElapsed}`, 120, 30);

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

class Projectile {
    constructor(startX, startY, target, speed, damage) {
        this.x = startX;
        this.y = startY;
        this.target = target;
        this.speed = speed;
        this.damage = damage;
    }

    move() {
        // Calculate direction towards the target
        const dirX = this.target.position.x - this.x;
        const dirY = this.target.position.y - this.y;
        const distance = Math.sqrt(dirX * dirX + dirY * dirY);

        // Normalize direction and move towards the target
        this.x += (dirX / distance) * this.speed;
        this.y += (dirY / distance) * this.speed;

        // Check if reached the target (or close enough)
        if (Math.abs(this.x - this.target.position.x) < this.speed &&
            Math.abs(this.y - this.target.position.y) < this.speed) {
            this.hitTarget();
        }
    }

    hitTarget() {
        // Damage the target monster
        this.target.health -= this.damage;

        // Remove the projectile (this will be handled in the game loop)
        this.isDestroyed = true;
    }
}


// Turret class
class Turret {
    constructor(x, y, range, damage) {
        this.x = x;
        this.y = y;
        this.range = range;
        this.damage = damage;
        this.cooldown = 0;
    }

    findTarget(monsters) {
        // Find the closest monster within range
        let target = null;
        let minDist = this.range;
        for (let monster of monsters) {
            let dx = this.x - monster.position.x;
            let dy = this.y - monster.position.y;
            let dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < minDist) {
                target = monster;
                minDist = dist;
            }
        }
        return target;
    }

    shoot(target) {
        if (this.cooldown === 0) {
            console.log('shoot', target);

            const projectile = new Projectile(this.x, this.y, target, 0.5, this.damage); // Speed and damage

            gameState.projectiles.push(projectile);

            // Implement shooting logic here
            // You could subtract health from the target monster
            //target.health -= this.damage;

            // Reset cooldown
            this.cooldown = 10; // Cooldown period for 60 frames, for example
        } else {
            console.log('cooldown', this.cooldown);
        }
    }

    update(monsters) {
        if (this.cooldown > 0) {
            this.cooldown--;
        }
        let target = this.findTarget(monsters);
        if (target) {
            this.shoot(target);
        }
    }
}

// Turret placement (example on grid click, extend with dragDropState for actual drag & drop)
canvas.addEventListener('click', function (event) {
    console.log('click', event);

    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left + offsetX;
    const y = event.clientY - rect.top - getHeaderHeight();
    const cellSize = getCellSize();

    // Convert click position to grid coordinates
    const gridX = Math.floor(x / cellSize);
    const gridY = Math.floor(y / cellSize);

    console.log('gridX', gridX, 'gridY', gridY, gameGrid[gridY][gridX]);

    // Place turret if the cell is free
    if (gameGrid[gridY][gridX] === 2) {
        const newTurret = new Turret(gridX, gridY, 3, 10); // Range and damage values are examples
        gameState.turrets.push(newTurret);
        gameGrid[gridY][gridX] = 2; // Update the grid to indicate a turret is placed
    }
});

// Monster class
class Monster {
    constructor(x, y, speed = 0.15, health = 100) {
        console.log('new monster', x, y);
        this.path = dijkstraWithCaching(gameGrid, {x: x, y: y}, orbs[0]);
        this.pathIndex = 0; // Start at the first point of the path
        this.position = {x: x, y: y}; // Current position of the monster
        this.speed = speed; // Speed of the monster, adjust as needed
        this.health = health; // Health of the monster, adjust as needed
    }

    move() {
        // If the monster has reached the end of the path, stop moving
        if (this.pathIndex === this.path.length - 1) {

            // destroy orb
            orbs.shift();

            if (0 === orbs.length) {

                console.log('game over', orbs);

                gameState.status = 'lost';

                return;

            }

            this.pathIndex = 0;

            this.path = dijkstraWithCaching(gameGrid, this.position, orbs[0]);

            return;
        }

        // Get the next point on the path
        const target = this.path[this.pathIndex + 1];

        // Calculate the direction vector from current position to the target
        const dir = {
            x: target.x - this.position.x,
            y: target.y - this.position.y
        };

        // Normalize the direction
        const length = Math.sqrt(dir.x * dir.x + dir.y * dir.y);
        dir.x /= length;
        dir.y /= length;

        // Move the monster towards the target
        this.position.x += dir.x * this.speed;
        this.position.y += dir.y * this.speed;

        // Check if the monster has reached the target point
        if (Math.hypot(this.position.x - target.x, this.position.y - target.y) < this.speed) {
            this.position = {...target}; // Snap to the target to avoid overshooting
            this.pathIndex++; // Move to the next point
        }
    }
}


class Spawner {
    constructor(interval, amount) {
        this.interval = interval; // The interval in frames between spawns
        this.counter = 0; // A counter to track when to spawn next
        this.amount = amount; // The number of monsters to spawn
    }

    update() {

        if (this.amount === 0) {

            return false;

        }

        if (this.counter === this.interval) {

            this.counter = 0; // Reset the counter

            this.amount--; // Reduce the ammount of monsters left to spawn

            // Spawn a new monster
            const spawnLocation = spawnLocations[Math.floor(Math.random() * spawnLocations.length)];

            gameState.monsters.push(new Monster(spawnLocation.x, spawnLocation.y));

        } else {

            this.counter++;

        }

        return true;

    }

}

const spawnLocations = [
    {x: 1, y: 1},
    {x: 1, y: 10},
    {x: 1, y: 11},
    {x: 1, y: 12},
    {x: 1, y: 24},
    {x: 1, y: 25},
    {x: 1, y: 34},
    {x: 1, y: 35},
]


// Main game loop
function gameLoop() {

    // Render the game
    renderGame();

    // be sure to render the final game board before exiting, aka don't change the order of these two lines
    if (gameState.status !== 'playing') {

        alert('Game Over! You ' + gameState.status + '!');

        return;

    }

    const cellSize = getCellSize();

    if (gameState.processedLevel < gameState.level) {

        gameState.processedLevel++;

        gameState.spawners.push(new Spawner(100, gameState.level));

    }

    // Update turrets and draw them
    for (const turret of gameState.turrets) {
        turret.update(gameState.monsters);
        ctx.fillStyle = 'rgba(172,39,192,0.66)'; // Color of the monster
        ctx.beginPath();
        ctx.fillRect(turret.x * cellSize, turret.y * cellSize, cellSize, cellSize);
        ctx.fill();
    }

    for (const projectile of gameState.projectiles) {
        if (undefined === projectile.target || true === projectile.isDestroyed) {
            // remove projectile from game state
            gameState.projectiles = gameState.projectiles.filter(p => p !== projectile);
            continue;
        }
        projectile.move();
        ctx.fillStyle = 'rgba(0,0,0,0.37)'; // Color of the monster
        ctx.beginPath();
        ctx.fillRect(projectile.x * cellSize, projectile.y * cellSize, cellSize, cellSize);
        ctx.fill();
    }

    // Draw the monster and then move it for next cycle
    for (const monster of gameState.monsters) {

        if (monster.health <= 0) {
            console.log('monster died');
            gameState.monsters = gameState.monsters.filter(m => m !== monster);
            continue;
        }

        /*// todo - remove, just for testing. this must happen before monster draw
        for (const route of monster.path) {
            ctx.fillStyle = 'rgb(39,192,42)';
            ctx.fillRect(route.x * cellSize, route.y * cellSize, cellSize, cellSize);
        }*/

        ctx.fillStyle = 'rgb(255,0,0)'; // Color of the monster
        ctx.beginPath();
        ctx.fillRect(monster.position.x * cellSize, monster.position.y * cellSize, cellSize, cellSize);
        ctx.fill();
        monster.move()

    }

    for (const spawner of gameState.spawners) {
        if (false === spawner.update()) {
            gameState.spawners = gameState.spawners.filter(s => s !== spawner);
        }
    }

    console.log(gameState)

    if (0 === gameState.monsters.length && 0 === gameState.spawners.length) {

        gameState.level++;

    }

    // Call the next frame
    requestAnimationFrame(gameLoop);

}

// Start the game loop
gameLoop();