
export default function GenerateRandomRGBA() {
    const r = Math.floor(Math.random() * 256); // Random between 0-255
    const g = Math.floor(Math.random() * 256); // Random between 0-255
    const b = Math.floor(Math.random() * 256); // Random between 0-255
    const a = Math.round((Math.random() * 1) * 100) / 100; // Random between 0-1 rounded to 2 decimal places
    return `rgba(${r}, ${g}, ${b}, ${a})`;
}

