// noinspection JSSuspiciousNameCombination

export function transpose<T>(matrix: T[][]): T[][] {
    // Create a new matrix with the flipped dimensions
    const rows = matrix.length, cols = matrix[0].length;
    const transposed = Array.from({length: cols}, () => Array(rows).fill(0));

    // Loop through each cell of the original matrix
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            // Assign the transposed value
            transposed[j][i] = matrix[i][j];
        }
    }

    return transposed;
}


export function rotateMatrix90Clockwise<T>(matrix: T[][]): T[][] {

    // Transpose the matrix
    const transpose = matrix[0].map((col, i) => matrix.map(row => row[i]));

    // Reverse each row for clockwise rotation
    return transpose.map(row => row.reverse());

}

function rotatePoint270Clockwise(x: number, y: number) {
    return {
        x: y,  // New x is the original y
        y: -x  // New y is -1 times the original x
    };
}

