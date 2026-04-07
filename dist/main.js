import { Engine } from './engine.js';
import { Renderer } from './renderer.js';
import { InputHandler } from './input.js';
class Game {
    engine;
    renderer;
    input;
    lastTime = 0;
    dropCounter = 0;
    dropInterval = 1000;
    constructor() {
        const canvas = document.getElementById('game-board');
        this.engine = new Engine();
        this.renderer = new Renderer(canvas);
        this.input = new InputHandler((dx, dy) => this.engine.movePiece(dx, dy), (clockwise) => this.engine.rotatePiece(clockwise), () => this.engine.hardDrop(), () => this.restart());
        window.addEventListener('resize', () => this.renderer.resize());
        this.engine.spawnPiece();
        this.requestNextFrame();
    }
    restart() {
        this.engine = new Engine();
        this.engine.spawnPiece();
        this.dropInterval = 1000;
    }
    update(time = 0) {
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
    updateUI(state) {
        document.getElementById('score').textContent = state.score.toString();
        document.getElementById('level').textContent = state.level.toString();
        document.getElementById('lines').textContent = state.linesCleared.toString();
    }
    requestNextFrame() {
        requestAnimationFrame((time) => this.update(time));
    }
}
// Initialize the game
new Game();
