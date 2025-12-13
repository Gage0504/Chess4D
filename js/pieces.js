/**
 * pieces.js
 * Chess piece classes with 4D movement logic
 */

class Piece {
    constructor(type, color, position) {
        this.type = type; // 'pawn', 'rook', 'knight', 'bishop', 'queen', 'king'
        this.color = color; // 'white' or 'black'
        this.position = position; // {w, x, y, z}
        this.hasMoved = false;
    }

    /**
     * Get all valid moves for this piece
     * To be overridden by subclasses
     */
    getValidMoves(board) {
        return [];
    }

    /**
     * Check if a move to target position is valid
     */
    canMoveTo(board, target) {
        const moves = this.getValidMoves(board);
        return moves.some(move => 
            move.w === target.w && 
            move.x === target.x && 
            move.y === target.y && 
            move.z === target.z
        );
    }

    /**
     * Create a clone of this piece
     */
    clone() {
        const cloned = new this.constructor(this.type, this.color, {...this.position});
        cloned.hasMoved = this.hasMoved;
        return cloned;
    }

    /**
     * Helper: Check if target square is capturable
     */
    isCapturableSquare(board, target) {
        const piece = board.getSquare(target.w, target.x, target.y, target.z);
        return piece && piece.color !== this.color;
    }

    /**
     * Helper: Check if target square is empty
     */
    isEmptySquare(board, target) {
        return board.isEmpty(target.w, target.x, target.y, target.z);
    }

    /**
     * Helper: Check if target square is valid and (empty or capturable)
     */
    isValidTarget(board, target) {
        if (!board.isValidCoordinate(target.w, target.x, target.y, target.z)) {
            return false;
        }
        const piece = board.getSquare(target.w, target.x, target.y, target.z);
        return !piece || piece.color !== this.color;
    }
}

class Rook extends Piece {
    constructor(color, position) {
        super('rook', color, position);
    }

    /**
     * Rook moves orthogonally in 4D: changes only ONE dimension at a time
     */
    getValidMoves(board) {
        const moves = [];
        const { w, x, y, z } = this.position;

        // Move along each dimension separately
        const directions = [
            { dw: 1, dx: 0, dy: 0, dz: 0 },  // +w
            { dw: -1, dx: 0, dy: 0, dz: 0 }, // -w
            { dw: 0, dx: 1, dy: 0, dz: 0 },  // +x
            { dw: 0, dx: -1, dy: 0, dz: 0 }, // -x
            { dw: 0, dx: 0, dy: 1, dz: 0 },  // +y
            { dw: 0, dx: 0, dy: -1, dz: 0 }, // -y
            { dw: 0, dx: 0, dy: 0, dz: 1 },  // +z
            { dw: 0, dx: 0, dy: 0, dz: -1 }  // -z
        ];

        for (const dir of directions) {
            let step = 1;
            while (true) {
                const target = {
                    w: w + dir.dw * step,
                    x: x + dir.dx * step,
                    y: y + dir.dy * step,
                    z: z + dir.dz * step
                };

                if (!board.isValidCoordinate(target.w, target.x, target.y, target.z)) {
                    break;
                }

                const piece = board.getSquare(target.w, target.x, target.y, target.z);
                if (piece) {
                    if (piece.color !== this.color) {
                        moves.push(target); // Can capture
                    }
                    break; // Can't move further
                }

                moves.push(target);
                step++;
            }
        }

        return moves;
    }
}

class Bishop extends Piece {
    constructor(color, position) {
        super('bishop', color, position);
    }

    /**
     * Bishop moves diagonally in 4D: changes exactly TWO dimensions at equal rates
     */
    getValidMoves(board) {
        const moves = [];
        const { w, x, y, z } = this.position;

        // Generate all combinations of two dimensions changing
        const dimensionPairs = [
            ['w', 'x'], ['w', 'y'], ['w', 'z'],
            ['x', 'y'], ['x', 'z'], ['y', 'z']
        ];

        for (const [dim1, dim2] of dimensionPairs) {
            // Four diagonal directions for each pair: ++, +-, -+, --
            const signs = [[1, 1], [1, -1], [-1, 1], [-1, -1]];
            
            for (const [sign1, sign2] of signs) {
                let step = 1;
                while (true) {
                    const target = { w, x, y, z };
                    target[dim1] += sign1 * step;
                    target[dim2] += sign2 * step;

                    if (!board.isValidCoordinate(target.w, target.x, target.y, target.z)) {
                        break;
                    }

                    const piece = board.getSquare(target.w, target.x, target.y, target.z);
                    if (piece) {
                        if (piece.color !== this.color) {
                            moves.push(target); // Can capture
                        }
                        break;
                    }

                    moves.push(target);
                    step++;
                }
            }
        }

        return moves;
    }
}

class Queen extends Piece {
    constructor(color, position) {
        super('queen', color, position);
    }

    /**
     * Queen combines rook and bishop movement
     */
    getValidMoves(board) {
        const rook = new Rook(this.color, this.position);
        const bishop = new Bishop(this.color, this.position);
        return [...rook.getValidMoves(board), ...bishop.getValidMoves(board)];
    }
}

class King extends Piece {
    constructor(color, position) {
        super('king', color, position);
    }

    /**
     * King moves like queen but only one step
     */
    getValidMoves(board) {
        const moves = [];
        const { w, x, y, z } = this.position;

        // One step in one dimension (orthogonal)
        const orthogonal = [
            { dw: 1, dx: 0, dy: 0, dz: 0 },
            { dw: -1, dx: 0, dy: 0, dz: 0 },
            { dw: 0, dx: 1, dy: 0, dz: 0 },
            { dw: 0, dx: -1, dy: 0, dz: 0 },
            { dw: 0, dx: 0, dy: 1, dz: 0 },
            { dw: 0, dx: 0, dy: -1, dz: 0 },
            { dw: 0, dx: 0, dy: 0, dz: 1 },
            { dw: 0, dx: 0, dy: 0, dz: -1 }
        ];

        // One step in two dimensions (diagonal)
        const diagonal = [];
        const dimensionPairs = [
            ['w', 'x'], ['w', 'y'], ['w', 'z'],
            ['x', 'y'], ['x', 'z'], ['y', 'z']
        ];

        for (const [dim1, dim2] of dimensionPairs) {
            const signs = [[1, 1], [1, -1], [-1, 1], [-1, -1]];
            for (const [sign1, sign2] of signs) {
                const delta = { dw: 0, dx: 0, dy: 0, dz: 0 };
                delta['d' + dim1] = sign1;
                delta['d' + dim2] = sign2;
                diagonal.push(delta);
            }
        }

        const allDirections = [...orthogonal, ...diagonal];

        for (const dir of allDirections) {
            const target = {
                w: w + dir.dw,
                x: x + dir.dx,
                y: y + dir.dy,
                z: z + dir.dz
            };

            if (this.isValidTarget(board, target)) {
                moves.push(target);
            }
        }

        return moves;
    }
}

class Knight extends Piece {
    constructor(color, position) {
        super('knight', color, position);
    }

    /**
     * Knight moves in L-shape in 4D: 2 steps in one dimension, 1 step in another
     */
    getValidMoves(board) {
        const moves = [];
        const { w, x, y, z } = this.position;

        // All combinations of moving 2 in one dimension and 1 in another
        const dimensions = ['w', 'x', 'y', 'z'];
        
        for (let i = 0; i < dimensions.length; i++) {
            for (let j = 0; j < dimensions.length; j++) {
                if (i === j) continue; // Must be different dimensions

                const dim2 = dimensions[i]; // Move 2 steps
                const dim1 = dimensions[j]; // Move 1 step

                // Try all sign combinations
                const moves2 = [2, -2];
                const moves1 = [1, -1];

                for (const move2 of moves2) {
                    for (const move1 of moves1) {
                        const target = { w, x, y, z };
                        target[dim2] += move2;
                        target[dim1] += move1;

                        if (this.isValidTarget(board, target)) {
                            moves.push(target);
                        }
                    }
                }
            }
        }

        return moves;
    }
}

class Pawn extends Piece {
    constructor(color, position) {
        super('pawn', color, position);
        // White pawns move forward in +z, black pawns in -z
        this.forwardDirection = (color === 'white') ? 1 : -1;
    }

    /**
     * Pawn moves forward (z-direction) and captures diagonally
     */
    getValidMoves(board) {
        const moves = [];
        const { w, x, y, z } = this.position;

        // Forward move (one step in z)
        const forward1 = { w, x, y, z: z + this.forwardDirection };
        if (board.isValidCoordinate(forward1.w, forward1.x, forward1.y, forward1.z) &&
            board.isEmpty(forward1.w, forward1.x, forward1.y, forward1.z)) {
            moves.push(forward1);

            // Double forward move from starting position
            if (!this.hasMoved) {
                const forward2 = { w, x, y, z: z + 2 * this.forwardDirection };
                if (board.isValidCoordinate(forward2.w, forward2.x, forward2.y, forward2.z) &&
                    board.isEmpty(forward2.w, forward2.x, forward2.y, forward2.z)) {
                    moves.push(forward2);
                }
            }
        }

        // Diagonal captures (forward in z, sideways in one other dimension)
        const captureDirs = [
            { dw: 1, dx: 0, dy: 0 },  // Forward-w
            { dw: -1, dx: 0, dy: 0 }, // Forward-w
            { dw: 0, dx: 1, dy: 0 },  // Forward-x
            { dw: 0, dx: -1, dy: 0 }, // Forward-x
            { dw: 0, dx: 0, dy: 1 },  // Forward-y
            { dw: 0, dx: 0, dy: -1 }  // Forward-y
        ];

        for (const dir of captureDirs) {
            const target = {
                w: w + dir.dw,
                x: x + dir.dx,
                y: y + dir.dy,
                z: z + this.forwardDirection
            };

            if (board.isValidCoordinate(target.w, target.x, target.y, target.z)) {
                const piece = board.getSquare(target.w, target.x, target.y, target.z);
                if (piece && piece.color !== this.color) {
                    moves.push(target); // Can capture
                }
            }
        }

        return moves;
    }
}
