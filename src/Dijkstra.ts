import GamePosition from "./Position";
import tGridPosition from "./tGridPosition";

function findNeighbors(node: GamePosition, grid: number[][]) {

    const directions = [[1, 0], [0, 1], [-1, 0], [0, -1]]; // Right, Down, Left, Up

    const result = [];

    for (let dir of directions) {

        const neighborPos = {
            x: Math.floor(node.position.x + dir[0]),
            y: Math.floor(node.position.y + dir[1])
        };

        //console.log(neighborPos, grid)

        if (neighborPos.x >= 0 && neighborPos.x < grid[0].length &&
            neighborPos.y >= 0 && neighborPos.y < grid.length &&
            grid[neighborPos.y][neighborPos.x] === 0) {

            result.push(new GamePosition(neighborPos, node.distance + 1));

        }

    }

    return result;

}

export function dijkstra(grid: number[][], start: tGridPosition, end: tGridPosition) {

    let startNode = new GamePosition(start, 0);
    let endNode = new GamePosition(end, Infinity);
    let unvisited = [startNode];
    let visited = new Set();

    while (unvisited.length > 0) {
        // Sort unvisited nodes by distance from the start node
        unvisited.sort((a, b) => a.distance - b.distance);

        let currentNode = unvisited.shift()!;

        // If we reach the end node, reconstruct and return the path
        if (currentNode.position.x === endNode.position.x && currentNode.position.y === endNode.position.y) {

            let path = [];

            let current: GamePosition | null = currentNode;

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

let dijkstraCache: { [key: string]: tGridPosition[] } = {};

function hashKeyForPath(start: tGridPosition, end: tGridPosition) {
    return `${start.x}-${start.y}_to_${end.x}-${end.y}`;
}

function getCachedPath(start: tGridPosition, end: tGridPosition) {
    const key = hashKeyForPath(start, end);
    return dijkstraCache[key];
}

function cachePath(start: tGridPosition, end: tGridPosition, path: tGridPosition[]) {
    const key = hashKeyForPath(start, end);
    dijkstraCache[key] = path;
}

// Modified Dijkstra's algorithm that uses caching
export function dijkstraWithCaching(grid: number[][], start: tGridPosition, end: tGridPosition) : tGridPosition[] {

    if (undefined === start || undefined === end) {
        return [];
    }

    // Check if the path is already in the cache
    const cachedPath = getCachedPath(start, end);

    if (cachedPath) {

        return cachedPath;

    }

    // Compute the path using Dijkstra's algorithm (not shown here for brevity)
    const path = dijkstra(grid, start, end);

    // Cache the computed path
    cachePath(start, end, path);

    return path;
}



