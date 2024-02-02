interface Point {
    x: number;
    y: number;
}

interface Cache {
    [key: string]: Point[];
}

const cache: Cache = {};

// Serialize the arguments to use as a cache key
function serializeArguments(start: Point, control: Point, end: Point, numPoints: number): string {
    return `${start.x},${start.y};${control.x},${control.y};${end.x},${end.y};${numPoints}`;
}

export default function Bezier(start: Point, control: Point, end: Point, numPoints: number): Point[] {
    // Generate a key for the current arguments
    const key = serializeArguments(start, control, end, numPoints);

    // Check if the result is already in the cache
    if (cache[key]) {
        return cache[key];
    }

    const curvePoints = [start];

    for (let i = 0; i <= numPoints; i++) {
        const t = i / numPoints;
        const x = (1 - t) ** 2 * start.x + 2 * (1 - t) * t * control.x + t ** 2 * end.x;
        const y = (1 - t) ** 2 * start.y + 2 * (1 - t) * t * control.y + t ** 2 * end.y;
        curvePoints.push({ x, y });
    }

    curvePoints.push(end);

    return curvePoints;

}


