import updateColorToRGBA from "./updateColorToRGBA";
import Entity, {iEntityConstructorProps} from "./Entity";

interface iAlert {
    message: string;
    seconds: number;
    fillStyle?: string;
    callback?: () => void;
}

export default class Alert extends Entity {
    private alertBoxVisible: boolean = true;
    private startTime: number = 0;
    message: string;
    seconds: number;
    fillStyle: string;
    callback?: () => void;


    constructor({message, seconds, gameState, callback, fillStyle = 'rgb(255, 0, 0)'}: iAlert & iEntityConstructorProps) {
        super({gameState});
        this.message = message;
        this.seconds = seconds;
        this.fillStyle = fillStyle;
        this.callback = callback;
    }

    move(): boolean {
        if (0 === this.startTime) {
            this.startTime = this.gameState.elapsedTime;
        }
        return this.alertBoxVisible
    }

    draw(): void {
        const ctx: CanvasRenderingContext2D = this.gameState.context;
        if (!this.alertBoxVisible) {

            return;

        }

        const timeElapsed = this.gameState.elapsedTime - this.startTime;

        const canvasWidth = ctx.canvas.width;

        const canvasHeight = ctx.canvas.height;

        const boxWidth = canvasWidth / 1.2;

        const boxHeight = canvasHeight / 12;

        const boxX = (canvasWidth - boxWidth) / 2;

        const boxY = (canvasHeight - boxHeight) / 2;

        // Calculate opacity based on elapsed time for fade out effect
        const fadeDuration = this.seconds; // Duration of the fade in milliseconds

        const opacity = Math.max(1 - timeElapsed / fadeDuration, 0);

        // Draw the transparent body of the box
        ctx.fillStyle = `rgba(0, 0, 0, ${opacity * 0.2})`; // Fade the body
        ctx.fillRect(boxX, boxY, boxWidth, boxHeight);

        const rgbaFillStyle = updateColorToRGBA(this.fillStyle, opacity);

        // Draw the red border
        ctx.strokeStyle = rgbaFillStyle; // Fade the border
        ctx.lineWidth = 3; // Adjust the border thickness here
        ctx.strokeRect(boxX, boxY, boxWidth, boxHeight);

        // Draw the message text
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.font = '4em Arial bold';
        ctx.fillStyle = rgbaFillStyle; // Fade the text
        ctx.fillText(this.message, canvasWidth / 2, canvasHeight / 2, boxWidth * 0.9);

        // Hide the alert box completely when opacity reaches 0
        if (timeElapsed >= this.seconds) {

            if (this.callback) {
                this.callback(); // todo - this is unsafe!?!?
            }

            this.alertBoxVisible = false;

        }

    }

}