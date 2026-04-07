import { Engine } from './engine.js';
import { Renderer } from './renderer.js';
import { InputHandler } from './input.js';

class Game {
    private engine: Engine;
    private renderer: Renderer;
    private input: InputHandler;
    private lastTime: number = 0;
    private dropCounter: number = 0;
    private dropInterval: number = 1000;

    constructor() {
        const canvas = document.getElementById('game-board') as HTMLCanvasElement;
        this.engine = new Engine();
        this.renderer = new Renderer(canvas);
        this.input = new InputHandler(
            (dx, dy) => this.engine.movePiece(dx, dy),
            (clockwise) => this.engine.rotatePiece(clockwise),
            () => this.engine.hardDrop(),
            () => this.restart()
        );

        window.addEventListener('resize', () => this.renderer.resize());
        this.engine.spawnPiece();
        this.requestNextFrame();
    }

    private restart(): void {
        this.engine = new Engine();
        this.engine.spawnPiece();
        this.dropInterval = 1000;
    }

    private update(time: number = 0): void {
        const deltaTime = time - this.lastTime;
        this.lastTime = time;

        this.input.update();

        const state = this.engine.getState();
        if (!state.isGameOver && !state.isPaused) {
            this.dropCounter += deltaTime;
            this.dropInterval = Math.max(100, 1000 - (state.level - 1) * 100);

            if (this.dropCounter > this.dropInterval) {
                this.engine.movePiece(0, 1);
                this.dropCounter = 0;
            }
        }

        this.updateUI(state);
        this.renderer.render(state);
        this.requestNextFrame();
    }

    private updateUI(state: any): void {
        document.getElementById('score')!.textContent = state.score.toString();
        document.getElementById('level')!.textContent = state.level.toString();
        document.getElementById('lines')!.textContent = state.linesCleared.toString();
    }

    private requestNextFrame(): void {
        requestAnimationFrame((time) => this.update(time));
    }
}

// Initialize the game
new Game();
