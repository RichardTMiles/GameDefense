import {getGameState} from "./GameDefense";
import {elapsedTime} from "./Header";


interface iWrapText {
    context: CanvasRenderingContext2D,
    text: string;
    x: number;
    y: number;
    w: number;
    h: number;
    scrollSpeed: number;
}

export default function WrapText({
                                     context,
                                     text,
                                     x,
                                     y,
                                     w,
                                     h,
                                     scrollSpeed
                                 }: iWrapText) {
    const words = text.split(' ');
    let line = '';
    let lines = []; // Array to store each line of text

    // First pass: calculate lines and total height
    for (let n = 0; n < words.length; n++) {
        const testLine = line + words[n] + ' ';
        const metrics = context.measureText(testLine);
        const testWidth = metrics.width;
        if (testWidth > w && n > 0) {
            lines.push({text: line, y: 0}); // Store line and its initial y position
            line = words[n] + ' ';
        } else {
            line = testLine;
        }
    }
    lines.push({text: line, y: 0}); // Add the last line

    // Calculate current scroll position based on elapsed time, ensuring text restarts once it scrolls off
    const time = elapsedTime(getGameState(), false); // Assuming this function is defined elsewhere

    let scrollOffset = (scrollSpeed * time) % (h);

    let currentY = y - scrollOffset;

    // Second pass: render lines based on current scroll position
    for (let i = 0; i < lines.length; i++) {
        lines[i].y = currentY + i * h; // Calculate y position for each line

        // Only draw the line if it's within the viewable area
        if (lines[i].y >= y && lines[i].y < y + h) {
            context.fillText(lines[i].text, x, lines[i].y);
        }
    }
}
