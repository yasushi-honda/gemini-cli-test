export class InputHandler {
    onMove;
    onRotate;
    onHardDrop;
    onRestart;
    keys = {};
    timers = {};
    lastRepeat = {};
    config = { das: 170, arr: 30 };
    constructor(onMove, onRotate, onHardDrop, onRestart) {
        this.onMove = onMove;
        this.onRotate = onRotate;
        this.onHardDrop = onHardDrop;
        this.onRestart = onRestart;
        window.addEventListener('keydown', (e) => this.handleKeyDown(e));
        window.addEventListener('keyup', (e) => this.handleKeyUp(e));
    }
    handleKeyDown(e) {
        const key = e.code;
        if (!this.keys[key]) {
            this.keys[key] = true;
            this.timers[key] = performance.now();
            this.lastRepeat[key] = 0;
            this.executeAction(key, true);
        }
    }
    handleKeyUp(e) {
        delete this.keys[e.code];
        delete this.timers[e.code];
        delete this.lastRepeat[e.code];
    }
    update() {
        const now = performance.now();
        for (const key in this.keys) {
            const startTime = this.timers[key];
            const elapsed = now - startTime;
            if (elapsed >= this.config.das) {
                const repeatElapsed = now - (this.lastRepeat[key] || startTime + this.config.das);
                if (repeatElapsed >= this.config.arr) {
                    this.executeAction(key, false);
                    this.lastRepeat[key] = now;
                }
            }
        }
    }
    executeAction(key, isInitial) {
        switch (key) {
            case 'ArrowLeft':
                this.onMove(-1, 0);
                break;
            case 'ArrowRight':
                this.onMove(1, 0);
                break;
            case 'ArrowDown':
                this.onMove(0, 1);
                break;
            case 'ArrowUp':
            case 'KeyX':
                if (isInitial)
                    this.onRotate(true);
                break;
            case 'KeyZ':
                if (isInitial)
                    this.onRotate(false);
                break;
            case 'Space':
                if (isInitial)
                    this.onHardDrop();
                break;
            case 'KeyR':
                if (isInitial)
                    this.onRestart();
                break;
        }
    }
}
