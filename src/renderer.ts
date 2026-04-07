import { GameState, Piece } from './types.js';
import { GRID_WIDTH, GRID_HEIGHT, TETROMINOS } from './constants.js';

export class Renderer {
    private ctx: CanvasRenderingContext2D;
    private cellSize: number = 0;

    constructor(private canvas: HTMLCanvasElement) {
        this.ctx = canvas.getContext('2d')!;
        this.resize();
    }

    public resize(): void {
        const parent = this.canvas.parentElement;
        if (!parent) return;

        const padding = 20;
        const availableHeight = parent.clientHeight - padding * 2;
        const availableWidth = parent.clientWidth - padding * 2;

        this.cellSize = Math.min(availableWidth / GRID_WIDTH, availableHeight / GRID_HEIGHT);
        
        this.canvas.width = this.cellSize * GRID_WIDTH;
        this.canvas.height = this.cellSize * GRID_HEIGHT;
    }

    public render(state: GameState): void {
        this.clear();
        this.drawGrid(state.grid);
        
        if (state.ghostPiece) {
            this.drawPiece(state.ghostPiece, true);
        }
        
        if (state.currentPiece) {
            this.drawPiece(state.currentPiece);
        }

        if (state.isGameOver) {
            this.drawGameOver();
        }
    }

    private clear(): void {
        this.ctx.fillStyle = '#1a1a1a';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw grid lines
        this.ctx.strokeStyle = '#333';
        this.ctx.lineWidth = 1;
        for (let x = 0; x <= GRID_WIDTH; x++) {
            this.ctx.beginPath();
            this.ctx.moveTo(x * this.cellSize, 0);
            this.ctx.lineTo(x * this.cellSize, this.canvas.height);
            this.ctx.stroke();
        }
        for (let y = 0; y <= GRID_HEIGHT; y++) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, y * this.cellSize);
            this.ctx.lineTo(this.canvas.width, y * this.cellSize);
            this.ctx.stroke();
        }
    }

    private drawGrid(grid: number[][]): void {
        for (let y = 0; y < GRID_HEIGHT; y++) {
            for (let x = 0; x < GRID_WIDTH; x++) {
                if (grid[y][x] !== 0) {
                    const color = this.getColorByCellValue(grid[y][x]);
                    this.drawBlock(x, y, color);
                }
            }
        }
    }

    private drawPiece(piece: Piece, isGhost: boolean = false): void {
        const color = TETROMINOS[piece.type].color;
        this.ctx.globalAlpha = isGhost ? 0.3 : 1.0;
        
        for (let y = 0; y < piece.shape.length; y++) {
            for (let x = 0; x < piece.shape[y].length; x++) {
                if (piece.shape[y][x] !== 0) {
                    this.drawBlock(piece.position.x + x, piece.position.y + y, color);
                }
            }
        }
        
        this.ctx.globalAlpha = 1.0;
    }

    private drawBlock(x: number, y: number, color: string): void {
        const px = x * this.cellSize;
        const py = y * this.cellSize;
        const size = this.cellSize;

        this.ctx.fillStyle = color;
        this.ctx.fillRect(px + 1, py + 1, size - 2, size - 2);

        // Highlight
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
        this.ctx.fillRect(px + 1, py + 1, size - 2, 2);
        this.ctx.fillRect(px + 1, py + 1, 2, size - 2);

        // Shadow
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
        this.ctx.fillRect(px + 1, py + size - 3, size - 2, 2);
        this.ctx.fillRect(px + size - 3, py + 1, 2, size - 2);
    }

    private getColorByCellValue(value: number): string {
        const types: (keyof typeof TETROMINOS)[] = ['I', 'J', 'L', 'O', 'S', 'T', 'Z'];
        return TETROMINOS[types[value - 1]].color;
    }

    private drawGameOver(): void {
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.ctx.fillStyle = 'white';
        this.ctx.font = 'bold 30px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('GAME OVER', this.canvas.width / 2, this.canvas.height / 2);
        
        this.ctx.font = '16px Arial';
        this.ctx.fillText('Press R to Restart', this.canvas.width / 2, this.canvas.height / 2 + 40);
    }
}
