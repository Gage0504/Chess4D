/**
 * ui.js
 * UI interaction handlers for 4D Chess game
 */

class ChessUI {
    constructor(game) {
        this.game = game;
        this.boardElement = null;
        this.validMoveHighlights = [];
        this.promotionCallback = null;
        this.currentPromotionPosition = null;
    }

    /**
     * Initialize the UI and render the board
     */
    initialize() {
        this.boardElement = document.getElementById('chess-board');
        this.renderBoard();
        this.updateStatus();
        this.updateCapturedPieces();
        this.updateMoveHistory();
        
        // Setup reset button
        document.getElementById('reset-btn').addEventListener('click', () => {
            this.game.reset();
            this.renderBoard();
            this.updateStatus();
            this.updateCapturedPieces();
            this.updateMoveHistory();
        });

        // Setup promotion dialog buttons once
        this.setupPromotionDialog();
    }

    /**
     * Setup promotion dialog event listeners (once)
     */
    setupPromotionDialog() {
        const dialog = document.getElementById('promotion-dialog');
        const buttons = dialog.querySelectorAll('.promotion-choice');
        
        buttons.forEach(button => {
            button.addEventListener('click', () => {
                if (this.currentPromotionPosition) {
                    const pieceType = button.dataset.piece;
                    this.game.promotePawn(this.currentPromotionPosition, pieceType);
                    dialog.style.display = 'none';
                    this.currentPromotionPosition = null;
                    this.renderBoard();
                    this.updateStatus();
                }
            });
        });
    }

    /**
     * Render the 4D chess board as 16 mini-boards in a 4×4 grid
     */
    renderBoard() {
        this.boardElement.innerHTML = '';
        
        // Create 16 mini-boards (4×4 grid of mini-boards)
        for (let w = 0; w < 4; w++) {
            for (let x = 0; x < 4; x++) {
                const miniBoard = this.createMiniBoard(w, x);
                this.boardElement.appendChild(miniBoard);
            }
        }
    }

    /**
     * Create a single mini-board (4×4 squares)
     */
    createMiniBoard(w, x) {
        const miniBoard = document.createElement('div');
        miniBoard.className = 'mini-board';
        miniBoard.dataset.w = w;
        miniBoard.dataset.x = x;
        
        // Add label
        const label = document.createElement('div');
        label.className = 'board-label';
        label.textContent = `W${w}X${x}`;
        miniBoard.appendChild(label);
        
        // Create 4×4 grid of squares
        const grid = document.createElement('div');
        grid.className = 'board-grid';
        
        for (let y = 0; y < 4; y++) {
            for (let z = 0; z < 4; z++) {
                const square = this.createSquare(w, x, y, z);
                grid.appendChild(square);
            }
        }
        
        miniBoard.appendChild(grid);
        return miniBoard;
    }

    /**
     * Create a single square
     */
    createSquare(w, x, y, z) {
        const square = document.createElement('div');
        square.className = 'square';
        square.dataset.w = w;
        square.dataset.x = x;
        square.dataset.y = y;
        square.dataset.z = z;
        
        // Checkered pattern
        const isLight = (w + x + y + z) % 2 === 0;
        square.classList.add(isLight ? 'light' : 'dark');
        
        // Add piece if present
        const piece = this.game.board.getSquare(w, x, y, z);
        if (piece) {
            const pieceElement = this.createPieceElement(piece);
            square.appendChild(pieceElement);
        }
        
        // Add click handler
        square.addEventListener('click', () => this.handleSquareClick(w, x, y, z));
        
        return square;
    }

    /**
     * Create a piece element with Unicode chess symbol
     */
    createPieceElement(piece) {
        const pieceElement = document.createElement('div');
        pieceElement.className = `piece ${piece.color}`;
        
        const symbols = {
            white: { king: '♔', queen: '♕', rook: '♖', bishop: '♗', knight: '♘', pawn: '♙' },
            black: { king: '♚', queen: '♛', rook: '♜', bishop: '♝', knight: '♞', pawn: '♟' }
        };
        
        pieceElement.textContent = symbols[piece.color][piece.type];
        return pieceElement;
    }

    /**
     * Handle click on a square
     */
    handleSquareClick(w, x, y, z) {
        const position = { w, x, y, z };
        
        // If no piece selected, try to select one
        if (!this.game.selectedPiece) {
            const piece = this.game.selectPiece(position);
            if (piece) {
                this.highlightValidMoves();
                this.renderBoard();
                this.markSelectedSquare(w, x, y, z);
            }
            return;
        }
        
        // If clicking on the same piece, deselect
        const selected = this.game.selectedPiece;
        if (selected.position.w === w && selected.position.x === x && 
            selected.position.y === y && selected.position.z === z) {
            this.game.selectedPiece = null;
            this.clearHighlights();
            this.renderBoard();
            return;
        }
        
        // Try to make the move
        const result = this.game.makeMove(position);
        
        if (result.success) {
            this.clearHighlights();
            this.renderBoard();
            this.updateStatus();
            this.updateCapturedPieces();
            this.updateMoveHistory();
            
            // Handle pawn promotion
            if (result.promotion) {
                this.showPromotionDialog(result.promotion);
            }
            
            // Show status message
            if (result.message) {
                this.showMessage(result.message);
            }
        } else {
            // Invalid move, try selecting new piece instead
            const piece = this.game.selectPiece(position);
            if (piece) {
                this.clearHighlights();
                this.highlightValidMoves();
                this.renderBoard();
                this.markSelectedSquare(w, x, y, z);
            }
        }
    }

    /**
     * Highlight valid moves for selected piece
     */
    highlightValidMoves() {
        const validMoves = this.game.getValidMovesForSelected();
        
        for (const move of validMoves) {
            const square = this.getSquareElement(move.w, move.x, move.y, move.z);
            if (square) {
                square.classList.add('valid-move');
                this.validMoveHighlights.push(square);
            }
        }
    }

    /**
     * Mark the selected square
     */
    markSelectedSquare(w, x, y, z) {
        const square = this.getSquareElement(w, x, y, z);
        if (square) {
            square.classList.add('selected');
        }
    }

    /**
     * Clear all highlights
     */
    clearHighlights() {
        this.validMoveHighlights.forEach(square => {
            square.classList.remove('valid-move');
        });
        this.validMoveHighlights = [];
        
        document.querySelectorAll('.selected').forEach(square => {
            square.classList.remove('selected');
        });
    }

    /**
     * Get square element by coordinates
     */
    getSquareElement(w, x, y, z) {
        return document.querySelector(
            `.square[data-w="${w}"][data-x="${x}"][data-y="${y}"][data-z="${z}"]`
        );
    }

    /**
     * Update status display
     */
    updateStatus() {
        const state = this.game.getState();
        const statusElement = document.getElementById('game-status');
        
        if (state.gameOver) {
            if (state.winner) {
                statusElement.textContent = `Checkmate! ${state.winner.toUpperCase()} wins!`;
                statusElement.className = 'status checkmate';
            } else {
                statusElement.textContent = 'Stalemate!';
                statusElement.className = 'status stalemate';
            }
        } else if (state.inCheck) {
            statusElement.textContent = `${state.currentPlayer.toUpperCase()}'s turn - Check!`;
            statusElement.className = 'status check';
        } else {
            statusElement.textContent = `${state.currentPlayer.toUpperCase()}'s turn`;
            statusElement.className = `status ${state.currentPlayer}`;
        }
    }

    /**
     * Update captured pieces display
     */
    updateCapturedPieces() {
        const state = this.game.getState();
        
        ['white', 'black'].forEach(color => {
            const container = document.getElementById(`captured-${color}`);
            container.innerHTML = '';
            
            const symbols = {
                white: { king: '♔', queen: '♕', rook: '♖', bishop: '♗', knight: '♘', pawn: '♙' },
                black: { king: '♚', queen: '♛', rook: '♜', bishop: '♝', knight: '♞', pawn: '♟' }
            };
            
            state.capturedPieces[color].forEach(piece => {
                const pieceSpan = document.createElement('span');
                pieceSpan.className = 'captured-piece';
                pieceSpan.textContent = symbols[piece.color][piece.type];
                container.appendChild(pieceSpan);
            });
        });
    }

    /**
     * Update move history display
     */
    updateMoveHistory() {
        const state = this.game.getState();
        const historyElement = document.getElementById('move-history');
        
        historyElement.innerHTML = '';
        
        state.moveHistory.forEach((move, index) => {
            const moveElement = document.createElement('div');
            moveElement.className = 'move-entry';
            
            const notation = this.getMoveNotation(move);
            moveElement.textContent = `${index + 1}. ${notation}`;
            
            historyElement.appendChild(moveElement);
        });
        
        // Scroll to bottom
        historyElement.scrollTop = historyElement.scrollHeight;
    }

    /**
     * Get move notation
     */
    getMoveNotation(move) {
        const pieceSymbol = {
            king: 'K', queen: 'Q', rook: 'R', 
            bishop: 'B', knight: 'N', pawn: ''
        }[move.piece];
        
        const from = `(${move.from.w},${move.from.x},${move.from.y},${move.from.z})`;
        const to = `(${move.to.w},${move.to.x},${move.to.y},${move.to.z})`;
        const capture = move.captured ? 'x' : '-';
        
        return `${pieceSymbol}${from}${capture}${to}`;
    }

    /**
     * Show a status message
     */
    showMessage(message) {
        const messageElement = document.getElementById('message');
        messageElement.textContent = message;
        messageElement.style.display = 'block';
        
        setTimeout(() => {
            messageElement.style.display = 'none';
        }, 3000);
    }

    /**
     * Show promotion dialog
     */
    showPromotionDialog(promotion) {
        const dialog = document.getElementById('promotion-dialog');
        this.currentPromotionPosition = promotion.position;
        dialog.style.display = 'flex';
    }
}
