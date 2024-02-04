import {tGameState} from "./InitialState";
import iEntity from "./interfaces/iEntity";
import {elapsedTime} from "./Header";

interface iAlert {
    message: string;
    seconds: number;
}

export default class Alert implements iEntity {
    private alertBoxVisible: boolean = true;
    private startTime: number = 0;
    message: string;
    seconds: number;
    private gameState: tGameState;


    constructor({message, seconds}: iAlert) {
        this.message = message;
        this.seconds = seconds;
    }

    move(gameState: tGameState): boolean {
        this.gameState ??= gameState;
        if (0 === this.startTime) {
            this.startTime = gameState.elapsedTime;
        }
        return this.alertBoxVisible
    }

    draw(ctx: CanvasRenderingContext2D): void {

        if (!this.alertBoxVisible) {

            return;

        }

        const timeElapsed = this.gameState.elapsedTime - this.startTime;

        const canvasWidth = ctx.canvas.width;

        const canvasHeight = ctx.canvas.height;

        const boxWidth = canvasWidth / 2;

        const boxHeight = canvasHeight / 12;

        const boxX = (canvasWidth - boxWidth) / 2;

        const boxY = (canvasHeight - boxHeight) / 2;

        // Calculate opacity based on elapsed time for fade out effect
        const fadeDuration = this.seconds; // Duration of the fade in milliseconds

        const opacity = Math.max(1 - timeElapsed / fadeDuration, 0);

        // Draw the transparent body of the box
        ctx.fillStyle = `rgba(255, 255, 255, ${opacity * 0.5})`; // Fade the body
        ctx.fillRect(boxX, boxY, boxWidth, boxHeight);

        // Draw the red border
        ctx.strokeStyle = `rgba(255, 0, 0, ${opacity})`; // Fade the border
        ctx.lineWidth = 3; // Adjust the border thickness here
        ctx.strokeRect(boxX, boxY, boxWidth, boxHeight);

        // Draw the message text
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.font = '3em Arial bold';
        ctx.fillStyle = `rgba(255, 0, 0, ${opacity})`; // Fade the text
        ctx.fillText(this.message, canvasWidth / 2, canvasHeight / 2);

        // Hide the alert box completely when opacity reaches 0
        if (timeElapsed >= this.seconds) {

            this.alertBoxVisible = false;

        }

    }

}