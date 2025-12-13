/**
 * board.js
 * 4D Chess Board Representation
 * Manages a 4×4×4×4 board structure (256 squares)
 */

class Board4D {
    constructor() {
        // Initialize 4D array: board[w][x][y][z]
        // Each coordinate ranges from 0-3
        this.grid = [];
        for (let w = 0; w < 4; w++) {
            this.grid[w] = [];
            for (let x = 0; x < 4; x++) {
                this.grid[w][x] = [];
                for (let y = 0; y < 4; y++) {
                    this.grid[w][x][y] = [];
                    for (let z = 0; z < 4; z++) {
                        this.grid[w][x][y][z] = null;
                    }
                }
            }
        }
    }

    /**
     * Get the piece at a given coordinate
     */
    getSquare(w, x, y, z) {
        if (!this.isValidCoordinate(w, x, y, z)) {
            return null;
        }
        return this.grid[w][x][y][z];
    }

    /**
     * Set a piece at a given coordinate
     */
    setSquare(w, x, y, z, piece) {
        if (!this.isValidCoordinate(w, x, y, z)) {
            return false;
        }
        this.grid[w][x][y][z] = piece;
        if (piece) {
            piece.position = { w, x, y, z };
        }
        return true;
    }

    /**
     * Check if coordinates are valid (within bounds)
     */
    isValidCoordinate(w, x, y, z) {
        return w >= 0 && w < 4 &&
               x >= 0 && x < 4 &&
               y >= 0 && y < 4 &&
               z >= 0 && z < 4;
    }

    /**
     * Check if a square is empty
     */
    isEmpty(w, x, y, z) {
        return this.getSquare(w, x, y, z) === null;
    }

    /**
     * Check if path between two positions is clear (for sliding pieces)
     * Returns true if all intermediate squares are empty
     */
    isPathClear(from, to) {
        const dw = Math.sign(to.w - from.w);
        const dx = Math.sign(to.x - from.x);
        const dy = Math.sign(to.y - from.y);
        const dz = Math.sign(to.z - from.z);

        let w = from.w + dw;
        let x = from.x + dx;
        let y = from.y + dy;
        let z = from.z + dz;

        // Check each square along the path
        while (w !== to.w || x !== to.x || y !== to.y || z !== to.z) {
            if (!this.isEmpty(w, x, y, z)) {
                return false;
            }
            if (w !== to.w) w += dw;
            if (x !== to.x) x += dx;
            if (y !== to.y) y += dy;
            if (z !== to.z) z += dz;
        }

        return true;
    }

    /**
     * Move a piece from one position to another
     */
    movePiece(from, to) {
        const piece = this.getSquare(from.w, from.x, from.y, from.z);
        if (!piece) {
            return false;
        }

        // Capture if there's an enemy piece
        const targetPiece = this.getSquare(to.w, to.x, to.y, to.z);
        
        // Remove from old position
        this.setSquare(from.w, from.x, from.y, from.z, null);
        
        // Place at new position
        this.setSquare(to.w, to.x, to.y, to.z, piece);
        
        // Mark piece as moved
        piece.hasMoved = true;

        return targetPiece; // Return captured piece if any
    }

    /**
     * Get all pieces of a given color
     */
    getPiecesByColor(color) {
        const pieces = [];
        for (let w = 0; w < 4; w++) {
            for (let x = 0; x < 4; x++) {
                for (let y = 0; y < 4; y++) {
                    for (let z = 0; z < 4; z++) {
                        const piece = this.grid[w][x][y][z];
                        if (piece && piece.color === color) {
                            pieces.push(piece);
                        }
                    }
                }
            }
        }
        return pieces;
    }

    /**
     * Find the king of a given color
     */
    findKing(color) {
        for (let w = 0; w < 4; w++) {
            for (let x = 0; x < 4; x++) {
                for (let y = 0; y < 4; y++) {
                    for (let z = 0; z < 4; z++) {
                        const piece = this.grid[w][x][y][z];
                        if (piece && piece.type === 'king' && piece.color === color) {
                            return piece;
                        }
                    }
                }
            }
        }
        return null;
    }

    /**
     * Create a deep copy of the board
     */
    clone() {
        const newBoard = new Board4D();
        for (let w = 0; w < 4; w++) {
            for (let x = 0; x < 4; x++) {
                for (let y = 0; y < 4; y++) {
                    for (let z = 0; z < 4; z++) {
                        const piece = this.grid[w][x][y][z];
                        if (piece) {
                            newBoard.grid[w][x][y][z] = piece.clone();
                        }
                    }
                }
            }
        }
        return newBoard;
    }
}
