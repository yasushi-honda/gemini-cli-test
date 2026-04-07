export interface InputConfig {
    das: number; // Delayed Auto Shift (ms)
    arr: number; // Auto Repeat Rate (ms)
}

export class InputHandler {
    private keys: Record<string, boolean> = {};
    private timers: Record<string, number> = {};
    private lastRepeat: Record<string, number> = {};
    private config: InputConfig = { das: 170, arr: 30 };

    constructor(
        private onMove: (dx: number, dy: number) => void,
        private onRotate: (clockwise: boolean) => void,
        private onHardDrop: () => void,
        private onRestart: () => void
    ) {
        window.addEventListener('keydown', (e) => this.handleKeyDown(e));
        window.addEventListener('keyup', (e) => this.handleKeyUp(e));
    }

    private handleKeyDown(e: KeyboardEvent): void {
        const key = e.code;
        if (!this.keys[key]) {
            this.keys[key] = true;
            this.timers[key] = performance.now();
            this.lastRepeat[key] = 0;
            this.executeAction(key, true);
        }
    }

    private handleKeyUp(e: KeyboardEvent): void {
        delete this.keys[e.code];
        delete this.timers[e.code];
        delete this.lastRepeat[e.code];
    }

    public update(): void {
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

    private executeAction(key: string, isInitial: boolean): void {
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
                if (isInitial) this.onRotate(true);
                break;
            case 'KeyZ':
                if (isInitial) this.onRotate(false);
                break;
            case 'Space':
                if (isInitial) this.onHardDrop();
                break;
            case 'KeyR':
                if (isInitial) this.onRestart();
                break;
        }
    }
}
