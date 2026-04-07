import { Grid, Piece, TetrominoType, GameState, Position, Cell } from './types.js';
import { GRID_WIDTH, GRID_HEIGHT, TETROMINOS, SRS_KICKS, SRS_I_KICKS } from './constants.js';

export class Engine {
    private state: GameState;
    private bag: TetrominoType[] = [];

    constructor() {
        this.state = this.getInitialState();
    }

    private getInitialState(): GameState {
        return {
            grid: Array.from({ length: GRID_HEIGHT }, () => Array(GRID_WIDTH).fill(0)),
            currentPiece: null,
            ghostPiece: null,
            nextPiece: this.pullFromBag(),
            holdPiece: null,
            score: 0,
            level: 1,
            linesCleared: 0,
            isGameOver: false,
            isPaused: false
        };
    }

    private pullFromBag(): TetrominoType {
        if (this.bag.length === 0) {
            this.bag = (['I', 'J', 'L', 'O', 'S', 'T', 'Z'] as TetrominoType[])
                .sort(() => Math.random() - 0.5);
        }
        return this.bag.pop()!;
    }

    public spawnPiece(): void {
        const type = this.state.nextPiece;
        this.state.nextPiece = this.pullFromBag();
        
        const tetromino = TETROMINOS[type];
        const piece: Piece = {
            type,
            shape: tetromino.shape,
            position: { x: Math.floor(GRID_WIDTH / 2) - Math.floor(tetromino.shape[0].length / 2), y: 0 },
            rotation: 0
        };

        if (this.checkCollision(piece.position, piece.shape)) {
            this.state.isGameOver = true;
        } else {
            this.state.currentPiece = piece;
            this.updateGhostPiece();
        }
    }

    public movePiece(dx: number, dy: number): boolean {
        if (!this.state.currentPiece || this.state.isGameOver || this.state.isPaused) return false;

        const newPos = {
            x: this.state.currentPiece.position.x + dx,
            y: this.state.currentPiece.position.y + dy
        };

        if (!this.checkCollision(newPos, this.state.currentPiece.shape)) {
            this.state.currentPiece.position = newPos;
            if (dy > 0) {
                // Gravity or soft drop
            }
            this.updateGhostPiece();
            return true;
        }

        if (dy > 0) {
            this.lockPiece();
        }
        return false;
    }

    public rotatePiece(clockwise: boolean = true): void {
        if (!this.state.currentPiece || this.state.isGameOver || this.state.isPaused) return;

        const current = this.state.currentPiece;
        const nextRotation = (current.rotation + (clockwise ? 1 : 3)) % 4;
        const newShape = this.rotateMatrix(current.shape, clockwise);
        
        // SRS Wall Kick check
        const kickData = current.type === 'I' ? SRS_I_KICKS : SRS_KICKS;
        const kickKey = `${current.rotation}-${nextRotation}`;
        const kicks = kickData[kickKey] || [{ x: 0, y: 0 }];

        for (const kick of kicks) {
            const newPos = {
                x: current.position.x + kick.x,
                y: current.position.y + kick.y
            };

            if (!this.checkCollision(newPos, newShape)) {
                current.position = newPos;
                current.shape = newShape;
                current.rotation = nextRotation;
                this.updateGhostPiece();
                return;
            }
        }
    }

    public hardDrop(): void {
        if (!this.state.currentPiece || this.state.isGameOver || this.state.isPaused) return;
        
        while (this.movePiece(0, 1)) {
            // Drop until collision
        }
    }

    private checkCollision(pos: Position, shape: number[][], grid: Grid = this.state.grid): boolean {
        for (let y = 0; y < shape.length; y++) {
            for (let x = 0; x < shape[y].length; x++) {
                if (shape[y][x] !== 0) {
                    const boardX = pos.x + x;
                    const boardY = pos.y + y;

                    if (boardX < 0 || boardX >= GRID_WIDTH || boardY >= GRID_HEIGHT) return true;
                    if (boardY >= 0 && grid[boardY][boardX] !== 0) return true;
                }
            }
        }
        return false;
    }

    private lockPiece(): void {
        if (!this.state.currentPiece) return;

        const { type, position, shape } = this.state.currentPiece;
        const cellValue = TETROMINOS[type].cellValue;

        for (let y = 0; y < shape.length; y++) {
            for (let x = 0; x < shape[y].length; x++) {
                if (shape[y][x] !== 0) {
                    const boardY = position.y + y;
                    const boardX = position.x + x;
                    if (boardY >= 0) {
                        this.state.grid[boardY][boardX] = cellValue;
                    }
                }
            }
        }

        this.clearLines();
        this.spawnPiece();
    }

    private clearLines(): void {
        let linesCleared = 0;
        for (let y = GRID_HEIGHT - 1; y >= 0; y--) {
            if (this.state.grid[y].every((cell: Cell) => cell !== 0)) {
                this.state.grid.splice(y, 1);
                this.state.grid.unshift(Array(GRID_WIDTH).fill(0));
                linesCleared++;
                y++; // Check the same row again
            }
        }

        if (linesCleared > 0) {
            this.state.linesCleared += linesCleared;
            this.state.score += this.calculateScore(linesCleared);
            this.state.level = Math.floor(this.state.linesCleared / 10) + 1;
        }
    }

    private calculateScore(lines: number): number {
        const baseScores = [0, 100, 300, 500, 800];
        return baseScores[lines] * this.state.level;
    }

    private updateGhostPiece(): void {
        if (!this.state.currentPiece) {
            this.state.ghostPiece = null;
            return;
        }

        const ghost = {
            ...this.state.currentPiece,
            position: { ...this.state.currentPiece.position }
        };

        while (!this.checkCollision({ x: ghost.position.x, y: ghost.position.y + 1 }, ghost.shape)) {
            ghost.position.y++;
        }

        this.state.ghostPiece = ghost;
    }

    private rotateMatrix(matrix: number[][], clockwise: boolean): number[][] {
        const N = matrix.length;
        const result = Array.from({ length: N }, () => Array(N).fill(0));
        for (let y = 0; y < N; y++) {
            for (let x = 0; x < N; x++) {
                if (clockwise) {
                    result[x][N - 1 - y] = matrix[y][x];
                } else {
                    result[N - 1 - x][y] = matrix[y][x];
                }
            }
        }
        return result;
    }

    public getState(): GameState {
        return { ...this.state, grid: this.state.grid.map((row: Cell[]) => [...row]) };
    }
}
