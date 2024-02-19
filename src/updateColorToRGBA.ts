export default function updateColorToRGBA(colorString: string, defaultOpacity = 0) {
    // Regular expression to match rgb or rgba
    const rgbRegex = /^rgb(a)?\((\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3})(,\s*([0-9\.]+))?\)$/;
    // Regular expression to match hex
    const hexRegex = /^#([0-9a-f]{3,8})$/i;

    let match = colorString.match(rgbRegex);
    if (match) {
        const isRGBA = match[1];
        const red = match[2];
        const green = match[3];
        const blue = match[4];
        let opacity = match[6] ? parseInt(match[6]) : defaultOpacity;

        if (!isRGBA || opacity === undefined) {
            opacity = defaultOpacity;
        }

        return `rgba(${red}, ${green}, ${blue}, ${opacity})`;
    } else if ((match = colorString.match(hexRegex))) {
        let hex = match[1];
        let r, g, b, a = 255; // Default alpha value is 255 (fully opaque)

        if (hex.length === 3) {
            r = parseInt(hex.charAt(0) + hex.charAt(0), 16);
            g = parseInt(hex.charAt(1) + hex.charAt(1), 16);
            b = parseInt(hex.charAt(2) + hex.charAt(2), 16);
        } else if (hex.length === 4) {
            r = parseInt(hex.charAt(0) + hex.charAt(0), 16);
            g = parseInt(hex.charAt(1) + hex.charAt(1), 16);
            b = parseInt(hex.charAt(2) + hex.charAt(2), 16);
            a = parseInt(hex.charAt(3) + hex.charAt(3), 16);
        } else if (hex.length === 6) {
            r = parseInt(hex.substring(0, 2), 16);
            g = parseInt(hex.substring(2, 4), 16);
            b = parseInt(hex.substring(4, 6), 16);
        } else if (hex.length === 8) {
            r = parseInt(hex.substring(0, 2), 16);
            g = parseInt(hex.substring(2, 4), 16);
            b = parseInt(hex.substring(4, 6), 16);
            a = parseInt(hex.substring(6, 8), 16);
        }

        // Convert alpha from 0-255 scale to 0-1 scale
        let alpha: number = parseInt((a / 255).toFixed(2));
        // Override alpha with defaultOpacity if it was fully opaque and defaultOpacity is set
        if (alpha === 1.00) {
            alpha = defaultOpacity;
        }

        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    } else {
        console.error("Invalid color format");
        return colorString; // Return the original string if it doesn't match RGB, RGBA, or hex format
    }
}

// Example usage:
/*
console.log(updateColorToRGBA("#ffcc00")); // Output: rgba(255, 204, 0, 0)
console.log(updateColorToRGBA("#ffcc0080")); // Output: rgba(255, 204, 0, 0.5)
console.log(updateColorToRGBA("rgb(255, 255, 255)")); // Output: rgba(255, 255, 255, 0)
console.log(updateColorToRGBA("rgba(255, 255, 255, 0.5)")); // Output: rgba(255, 255, 255, 0.5)
*/
