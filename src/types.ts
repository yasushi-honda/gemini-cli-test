export type Cell = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7; // 0 for empty, 1-7 for Tetromino colors

export type Grid = Cell[][];

export type TetrominoType = 'I' | 'J' | 'L' | 'O' | 'S' | 'T' | 'Z';

export interface Position {
    x: number;
    y: number;
}

export interface Piece {
    type: TetrominoType;
    shape: number[][];
    position: Position;
    rotation: number; // 0, 1, 2, 3 (degrees: 0, 90, 180, 270)
}

export interface GameState {
    grid: Grid;
    currentPiece: Piece | null;
    ghostPiece: Piece | null;
    nextPiece: TetrominoType;
    holdPiece: TetrominoType | null;
    score: number;
    level: number;
    linesCleared: number;
    isGameOver: boolean;
    isPaused: boolean;
}
