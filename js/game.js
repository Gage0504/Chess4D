/**
 * game.js
 * 4D Chess Game Engine - manages game state, rules, and logic
 */

class ChessGame {
    constructor() {
        this.board = new Board4D();
        this.currentPlayer = 'white'; // White starts
        this.gameOver = false;
        this.winner = null;
        this.moveHistory = [];
        this.capturedPieces = { white: [], black: [] };
        this.selectedPiece = null;
        
        this.initializeBoard();
    }

    /**
     * Initialize the board with standard chess pieces in 4D
     */
    initializeBoard() {
        // White pieces - starting at z=0 and z=1 layers
        // Layer z=0: heavier pieces
        this.board.setSquare(0, 0, 0, 0, new Rook('white', { w: 0, x: 0, y: 0, z: 0 }));
        this.board.setSquare(0, 3, 0, 0, new Rook('white', { w: 0, x: 3, y: 0, z: 0 }));
        this.board.setSquare(0, 1, 0, 0, new Knight('white', { w: 0, x: 1, y: 0, z: 0 }));
        this.board.setSquare(0, 2, 0, 0, new Knight('white', { w: 0, x: 2, y: 0, z: 0 }));
        this.board.setSquare(1, 0, 0, 0, new Bishop('white', { w: 1, x: 0, y: 0, z: 0 }));
        this.board.setSquare(1, 3, 0, 0, new Bishop('white', { w: 1, x: 3, y: 0, z: 0 }));
        this.board.setSquare(1, 1, 0, 0, new Queen('white', { w: 1, x: 1, y: 0, z: 0 }));
        this.board.setSquare(1, 2, 0, 0, new King('white', { w: 1, x: 2, y: 0, z: 0 }));
        
        // Layer z=1: pawns
        for (let w = 0; w < 4; w++) {
            for (let x = 0; x < 4; x++) {
                if ((w < 2 && x < 4) || (w >= 2 && x < 2)) { // 8 pawns total
                    this.board.setSquare(w, x, 0, 1, new Pawn('white', { w, x, y: 0, z: 1 }));
                }
            }
        }

        // Black pieces - starting at z=3 and z=2 layers
        // Layer z=3: heavier pieces
        this.board.setSquare(0, 0, 0, 3, new Rook('black', { w: 0, x: 0, y: 0, z: 3 }));
        this.board.setSquare(0, 3, 0, 3, new Rook('black', { w: 0, x: 3, y: 0, z: 3 }));
        this.board.setSquare(0, 1, 0, 3, new Knight('black', { w: 0, x: 1, y: 0, z: 3 }));
        this.board.setSquare(0, 2, 0, 3, new Knight('black', { w: 0, x: 2, y: 0, z: 3 }));
        this.board.setSquare(1, 0, 0, 3, new Bishop('black', { w: 1, x: 0, y: 0, z: 3 }));
        this.board.setSquare(1, 3, 0, 3, new Bishop('black', { w: 1, x: 3, y: 0, z: 3 }));
        this.board.setSquare(1, 1, 0, 3, new Queen('black', { w: 1, x: 1, y: 0, z: 3 }));
        this.board.setSquare(1, 2, 0, 3, new King('black', { w: 1, x: 2, y: 0, z: 3 }));

        // Layer z=2: pawns
        for (let w = 0; w < 4; w++) {
            for (let x = 0; x < 4; x++) {
                if ((w < 2 && x < 4) || (w >= 2 && x < 2)) { // 8 pawns total
                    this.board.setSquare(w, x, 0, 2, new Pawn('black', { w, x, y: 0, z: 2 }));
                }
            }
        }
    }

    /**
     * Select a piece at the given position
     */
    selectPiece(position) {
        const piece = this.board.getSquare(position.w, position.x, position.y, position.z);
        
        if (!piece || piece.color !== this.currentPlayer || this.gameOver) {
            this.selectedPiece = null;
            return null;
        }
        
        this.selectedPiece = piece;
        return piece;
    }

    /**
     * Get valid moves for the currently selected piece
     */
    getValidMovesForSelected() {
        if (!this.selectedPiece) {
            return [];
        }
        
        const allMoves = this.selectedPiece.getValidMoves(this.board);
        
        // Filter out moves that would leave king in check
        return allMoves.filter(move => {
            return !this.wouldBeInCheck(this.selectedPiece, move);
        });
    }

    /**
     * Check if moving a piece would leave the king in check
     */
    wouldBeInCheck(piece, targetPos) {
        // Create temporary board state
        const tempBoard = this.board.clone();
        const from = piece.position;
        
        // Make the move on temp board
        tempBoard.movePiece(from, targetPos);
        
        // Check if king is in check
        return this.isInCheck(piece.color, tempBoard);
    }

    /**
     * Check if a player is in check
     */
    isInCheck(color, board = this.board) {
        const king = board.findKing(color);
        if (!king) return false;

        const enemyColor = color === 'white' ? 'black' : 'white';
        const enemyPieces = board.getPiecesByColor(enemyColor);

        // Check if any enemy piece can attack the king
        for (const piece of enemyPieces) {
            const moves = piece.getValidMoves(board);
            if (moves.some(move => 
                move.w === king.position.w && 
                move.x === king.position.x && 
                move.y === king.position.y && 
                move.z === king.position.z
            )) {
                return true;
            }
        }

        return false;
    }

    /**
     * Check if a player is in checkmate
     */
    isCheckmate(color) {
        if (!this.isInCheck(color)) {
            return false;
        }

        // Check if any move can get out of check
        const pieces = this.board.getPiecesByColor(color);
        for (const piece of pieces) {
            const moves = piece.getValidMoves(this.board);
            for (const move of moves) {
                if (!this.wouldBeInCheck(piece, move)) {
                    return false; // Found a valid move
                }
            }
        }

        return true; // No valid moves, it's checkmate
    }

    /**
     * Check if the game is in stalemate
     */
    isStalemate(color) {
        if (this.isInCheck(color)) {
            return false; // Not stalemate if in check
        }

        // Check if player has any valid moves
        const pieces = this.board.getPiecesByColor(color);
        for (const piece of pieces) {
            const moves = piece.getValidMoves(this.board);
            for (const move of moves) {
                if (!this.wouldBeInCheck(piece, move)) {
                    return false; // Found a valid move
                }
            }
        }

        return true; // No valid moves and not in check = stalemate
    }

    /**
     * Attempt to move the selected piece to target position
     */
    makeMove(targetPos) {
        if (!this.selectedPiece || this.gameOver) {
            return { success: false, message: "No piece selected" };
        }

        const validMoves = this.getValidMovesForSelected();
        const isValidMove = validMoves.some(move => 
            move.w === targetPos.w && 
            move.x === targetPos.x && 
            move.y === targetPos.y && 
            move.z === targetPos.z
        );

        if (!isValidMove) {
            return { success: false, message: "Invalid move" };
        }

        const from = this.selectedPiece.position;
        const capturedPiece = this.board.movePiece(from, targetPos);

        // Handle captured piece
        if (capturedPiece) {
            this.capturedPieces[this.currentPlayer].push(capturedPiece);
        }

        // Check for pawn promotion
        const movedPiece = this.board.getSquare(targetPos.w, targetPos.x, targetPos.y, targetPos.z);
        let promotion = null;
        if (movedPiece.type === 'pawn') {
            // White pawns promote at z=3, black pawns at z=0
            if ((movedPiece.color === 'white' && targetPos.z === 3) ||
                (movedPiece.color === 'black' && targetPos.z === 0)) {
                promotion = { position: targetPos, color: movedPiece.color };
            }
        }

        // Record move
        this.moveHistory.push({
            from,
            to: targetPos,
            piece: movedPiece.type,
            captured: capturedPiece ? capturedPiece.type : null,
            player: this.currentPlayer
        });

        // Switch players
        this.currentPlayer = this.currentPlayer === 'white' ? 'black' : 'white';
        this.selectedPiece = null;

        // Check game end conditions
        if (this.isCheckmate(this.currentPlayer)) {
            this.gameOver = true;
            this.winner = this.currentPlayer === 'white' ? 'black' : 'white';
            return { 
                success: true, 
                gameOver: true, 
                winner: this.winner,
                message: `Checkmate! ${this.winner} wins!`,
                promotion
            };
        }

        if (this.isStalemate(this.currentPlayer)) {
            this.gameOver = true;
            return { 
                success: true, 
                gameOver: true, 
                stalemate: true,
                message: "Stalemate!",
                promotion
            };
        }

        const inCheck = this.isInCheck(this.currentPlayer);
        return { 
            success: true, 
            check: inCheck,
            message: inCheck ? "Check!" : null,
            promotion
        };
    }

    /**
     * Promote a pawn to another piece type
     */
    promotePawn(position, pieceType) {
        const pawn = this.board.getSquare(position.w, position.x, position.y, position.z);
        if (!pawn || pawn.type !== 'pawn') {
            return false;
        }

        let newPiece;
        switch (pieceType) {
            case 'queen':
                newPiece = new Queen(pawn.color, position);
                break;
            case 'rook':
                newPiece = new Rook(pawn.color, position);
                break;
            case 'bishop':
                newPiece = new Bishop(pawn.color, position);
                break;
            case 'knight':
                newPiece = new Knight(pawn.color, position);
                break;
            default:
                return false;
        }

        newPiece.hasMoved = true;
        this.board.setSquare(position.w, position.x, position.y, position.z, newPiece);
        return true;
    }

    /**
     * Reset the game
     */
    reset() {
        this.board = new Board4D();
        this.currentPlayer = 'white';
        this.gameOver = false;
        this.winner = null;
        this.moveHistory = [];
        this.capturedPieces = { white: [], black: [] };
        this.selectedPiece = null;
        this.initializeBoard();
    }

    /**
     * Get current game state
     */
    getState() {
        return {
            currentPlayer: this.currentPlayer,
            gameOver: this.gameOver,
            winner: this.winner,
            inCheck: this.isInCheck(this.currentPlayer),
            selectedPiece: this.selectedPiece,
            moveHistory: this.moveHistory,
            capturedPieces: this.capturedPieces
        };
    }
}
