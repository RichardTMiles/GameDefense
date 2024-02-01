export function drawGradientCircleHeader(ctx: CanvasRenderingContext2D, x: number, y: number, radius: number, colorStart: string, colorEnd: string) {
    let gradient = ctx.createRadialGradient(x, y, radius * 0.1, x, y, radius);
    gradient.addColorStop(0, colorStart);
    gradient.addColorStop(1, colorEnd);
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fillStyle = gradient;
    ctx.fill();
}

