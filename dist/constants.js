export const GRID_WIDTH = 10;
export const GRID_HEIGHT = 20;
export const TETROMINOS = {
    'I': {
        shape: [[0, 0, 0, 0], [1, 1, 1, 1], [0, 0, 0, 0], [0, 0, 0, 0]],
        color: '#00f0f0',
        cellValue: 1
    },
    'J': {
        shape: [[1, 0, 0], [1, 1, 1], [0, 0, 0]],
        color: '#0000f0',
        cellValue: 2
    },
    'L': {
        shape: [[0, 0, 1], [1, 1, 1], [0, 0, 0]],
        color: '#f0a000',
        cellValue: 3
    },
    'O': {
        shape: [[1, 1], [1, 1]],
        color: '#f0f000',
        cellValue: 4
    },
    'S': {
        shape: [[0, 1, 1], [1, 1, 0], [0, 0, 0]],
        color: '#00f000',
        cellValue: 5
    },
    'T': {
        shape: [[0, 1, 0], [1, 1, 1], [0, 0, 0]],
        color: '#a000f0',
        cellValue: 6
    },
    'Z': {
        shape: [[1, 1, 0], [0, 1, 1], [0, 0, 0]],
        color: '#f00000',
        cellValue: 7
    }
};
// SRS (Super Rotation System) Wall Kicks
// Kick data for pieces (except I and O)
export const SRS_KICKS = {
    '0-1': [{ x: 0, y: 0 }, { x: -1, y: 0 }, { x: -1, y: 1 }, { x: 0, y: -2 }, { x: -1, y: -2 }],
    '1-0': [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 1, y: -1 }, { x: 0, y: 2 }, { x: 1, y: 2 }],
    '1-2': [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 1, y: -1 }, { x: 0, y: 2 }, { x: 1, y: 2 }],
    '2-1': [{ x: 0, y: 0 }, { x: -1, y: 0 }, { x: -1, y: 1 }, { x: 0, y: -2 }, { x: -1, y: -2 }],
    '2-3': [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 1, y: 1 }, { x: 0, y: -2 }, { x: 1, y: -2 }],
    '3-2': [{ x: 0, y: 0 }, { x: -1, y: 0 }, { x: -1, y: -1 }, { x: 0, y: 2 }, { x: -1, y: 2 }],
    '3-0': [{ x: 0, y: 0 }, { x: -1, y: 0 }, { x: -1, y: -1 }, { x: 0, y: 2 }, { x: -1, y: 2 }],
    '0-3': [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 1, y: 1 }, { x: 0, y: -2 }, { x: 1, y: -2 }]
};
// SRS (Super Rotation System) Wall Kicks for 'I' piece
export const SRS_I_KICKS = {
    '0-1': [{ x: 0, y: 0 }, { x: -2, y: 0 }, { x: 1, y: 0 }, { x: -2, y: -1 }, { x: 1, y: 2 }],
    '1-0': [{ x: 0, y: 0 }, { x: 2, y: 0 }, { x: -1, y: 0 }, { x: 2, y: 1 }, { x: -1, y: -2 }],
    '1-2': [{ x: 0, y: 0 }, { x: -1, y: 0 }, { x: 2, y: 0 }, { x: -1, y: 2 }, { x: 2, y: -1 }],
    '2-1': [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: -2, y: 0 }, { x: 1, y: -2 }, { x: -2, y: 1 }],
    '2-3': [{ x: 0, y: 0 }, { x: 2, y: 0 }, { x: -1, y: 0 }, { x: 2, y: 1 }, { x: -1, y: -2 }],
    '3-2': [{ x: 0, y: 0 }, { x: -2, y: 0 }, { x: 1, y: 0 }, { x: -2, y: -1 }, { x: 1, y: 2 }],
    '3-0': [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: -2, y: 0 }, { x: 1, y: -2 }, { x: -2, y: 1 }],
    '0-3': [{ x: 0, y: 0 }, { x: -1, y: 0 }, { x: 2, y: 0 }, { x: -1, y: 2 }, { x: 2, y: -1 }]
};
