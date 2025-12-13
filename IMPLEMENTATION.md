# 4D Chess Implementation Details

## Overview

This document describes the technical implementation of the 4D chess game system.

## Architecture

### Core Components

1. **Board Representation** (`js/board.js`)
   - 4D array structure: `grid[w][x][y][z]`
   - Coordinate validation
   - Piece placement and retrieval
   - Path checking for sliding pieces
   - Board cloning for move simulation

2. **Piece Classes** (`js/pieces.js`)
   - Base `Piece` class with common functionality
   - Specialized classes for each piece type:
     - `Rook`: Orthogonal (1D) movement
     - `Bishop`: Diagonal (2D) movement
     - `Queen`: Combined rook + bishop
     - `King`: Like queen but 1 step only
     - `Knight`: L-shaped (2+1) movement
     - `Pawn`: Forward movement with diagonal captures

3. **Game Engine** (`js/game.js`)
   - Game state management
   - Turn-based logic
   - Move validation
   - Check/checkmate/stalemate detection
   - Pawn promotion
   - Move history

4. **User Interface** (`js/ui.js`)
   - Board rendering (16 mini-boards)
   - Piece selection and move highlighting
   - Status display
   - Move history tracking
   - Captured pieces display
   - Promotion dialog

5. **Initialization** (`js/main.js`)
   - Game and UI setup
   - Event binding

## 4D Movement Logic

### Coordinate System

Each position has 4 coordinates: `(w, x, y, z)`, all ranging 0-3.

- `(w, x)`: Determines which mini-board (grid position)
- `(y, z)`: Determines square within mini-board

### Movement Types

#### 1. Orthogonal (Rook)
Changes **one coordinate** at a time:
```
From (1,1,1,1):
- W-axis: (0,1,1,1), (2,1,1,1), (3,1,1,1)
- X-axis: (1,0,1,1), (1,2,1,1), (1,3,1,1)
- Y-axis: (1,1,0,1), (1,1,2,1), (1,1,3,1)
- Z-axis: (1,1,1,0), (1,1,1,2), (1,1,1,3)
```

Total: 4 axes × 2 directions = 8 orthogonal directions

#### 2. Diagonal (Bishop)
Changes **two coordinates** equally:
```
From (1,1,1,1):
- W+X: (2,2,1,1), (3,3,1,1), (0,0,1,1)
- W+Y: (2,1,2,1), (3,1,3,1), (0,1,0,1)
- W+Z: (2,1,1,2), (3,1,1,3), (0,1,1,0)
- X+Y: (1,2,2,1), (1,3,3,1), (1,0,0,1)
- X+Z: (1,2,1,2), (1,3,1,3), (1,0,1,0)
- Y+Z: (1,1,2,2), (1,1,3,3), (1,1,0,0)
```

Total: C(4,2) = 6 diagonal planes × 4 directions = 24 diagonal directions

#### 3. L-Shape (Knight)
Moves **2 steps in one dimension, 1 step in another**:
```
From (1,1,1,1):
- 2 in W, 1 in X: (3,2,1,1), (3,0,1,1)
- 2 in W, 1 in Y: (3,1,2,1), (3,1,0,1)
- 2 in W, 1 in Z: (3,1,1,2), (3,1,1,0)
- ... (and all other combinations)
```

Total: P(4,2) × 4 = 12 dimension pairs × 4 sign combinations = 48 knight moves

### Path Checking

For sliding pieces (rook, bishop, queen), the path must be clear:

```javascript
isPathClear(from, to) {
    // Calculate step direction for each dimension
    const dw = Math.sign(to.w - from.w);
    const dx = Math.sign(to.x - from.x);
    const dy = Math.sign(to.y - from.y);
    const dz = Math.sign(to.z - from.z);
    
    // Check each square along the path
    // Stop before reaching target (target may contain capturable piece)
}
```

## Check Detection

To determine if a player is in check:

1. Find the king of that color
2. Get all enemy pieces
3. For each enemy piece, get its valid moves
4. If any move attacks the king's position, it's check

```javascript
isInCheck(color, board) {
    const king = board.findKing(color);
    const enemyPieces = board.getPiecesByColor(enemyColor);
    
    for (const piece of enemyPieces) {
        const moves = piece.getValidMoves(board);
        if (moves includes king.position) {
            return true;
        }
    }
    return false;
}
```

## Move Validation

A move is valid only if:

1. It follows the piece's movement rules
2. The path is clear (for non-knights)
3. The destination is empty or contains an enemy piece
4. The move doesn't leave the player's own king in check

```javascript
wouldBeInCheck(piece, targetPos) {
    // Clone the board
    const tempBoard = this.board.clone();
    
    // Make the move on the clone
    tempBoard.movePiece(piece.position, targetPos);
    
    // Check if king is in check on the cloned board
    return this.isInCheck(piece.color, tempBoard);
}
```

## Checkmate Detection

Checkmate occurs when:
1. The player is in check, AND
2. No legal move can remove the check

```javascript
isCheckmate(color) {
    if (!this.isInCheck(color)) return false;
    
    // Try all possible moves
    const pieces = this.board.getPiecesByColor(color);
    for (const piece of pieces) {
        const moves = piece.getValidMoves(this.board);
        for (const move of moves) {
            if (!this.wouldBeInCheck(piece, move)) {
                return false; // Found a legal move
            }
        }
    }
    return true; // No legal moves available
}
```

## Stalemate Detection

Stalemate is similar to checkmate but without being in check:
1. The player is NOT in check, AND
2. The player has no legal moves

## UI Implementation

### Board Display

The board is rendered as a grid of 16 mini-boards:

```html
<div id="chess-board">
  <!-- 16 mini-boards, each labeled W{w}X{x} -->
  <div class="mini-board" data-w="0" data-x="0">
    <div class="board-label">W0X0</div>
    <div class="board-grid">
      <!-- 16 squares, each at position (y,z) -->
      <div class="square" data-y="0" data-z="0">
        <!-- Piece if present -->
      </div>
    </div>
  </div>
</div>
```

### Interaction Flow

1. **Click piece**: Select if it's player's turn and their color
2. **Show valid moves**: Highlight all legal moves
3. **Click destination**: Attempt to make the move
4. **Validate move**: Check legality and update game state
5. **Update display**: Render new board state
6. **Check game end**: Test for check/checkmate/stalemate

### Visual Feedback

- **Selected piece**: Green highlight
- **Valid moves**: Yellow highlight with dot marker
- **Check**: Orange status background with pulse animation
- **Checkmate**: Red status background
- **Piece colors**: Unicode symbols with contrasting colors

## Data Structures

### Position
```javascript
{ w: number, x: number, y: number, z: number }
```

### Piece
```javascript
{
    type: 'pawn' | 'rook' | 'knight' | 'bishop' | 'queen' | 'king',
    color: 'white' | 'black',
    position: { w, x, y, z },
    hasMoved: boolean
}
```

### Move
```javascript
{
    from: { w, x, y, z },
    to: { w, x, y, z },
    piece: string,
    captured: string | null,
    player: 'white' | 'black'
}
```

### Game State
```javascript
{
    board: Board4D,
    currentPlayer: 'white' | 'black',
    gameOver: boolean,
    winner: 'white' | 'black' | null,
    moveHistory: Move[],
    capturedPieces: { white: Piece[], black: Piece[] },
    selectedPiece: Piece | null
}
```

## Performance Considerations

1. **Board Cloning**: Used for move simulation, creates deep copy
2. **Move Generation**: Each piece calculates moves on demand
3. **Checkmate Detection**: May require checking many positions
4. **UI Updates**: Full board re-render after each move

## Future Enhancements

Potential improvements:

1. **Move Validation Caching**: Cache legal moves for current position
2. **AI Opponent**: Implement minimax with alpha-beta pruning in 4D
3. **Move Notation**: Standard algebraic notation for 4D
4. **En Passant**: Implement pawn en passant capture
5. **Castling**: Define and implement 4D castling rules
6. **Draw Rules**: 50-move rule, threefold repetition
7. **Time Controls**: Add chess clocks
8. **Undo/Redo**: Move history navigation
9. **Save/Load**: Game state persistence
10. **Online Multiplayer**: WebSocket-based play

## Testing

Key test cases:

1. ✓ Board initialization (256 squares)
2. ✓ Piece placement (16 pieces per side)
3. ✓ Movement rules for each piece type
4. ✓ Path blocking for sliding pieces
5. ✓ Check detection
6. ✓ Checkmate scenarios
7. ✓ Stalemate scenarios
8. ✓ Pawn promotion
9. ✓ Move validation
10. ✓ UI interaction

## Known Limitations

1. No AI opponent (human vs human only)
2. No move animation
3. No sound effects
4. No en passant for pawns
5. No castling
6. No draw by repetition detection
7. No time controls

## Credits

This implementation was inspired by:
- [BrianSantoso/4D-Chess](https://github.com/BrianSantoso/4D-Chess)
- [4D Chess Server](https://github.com/BrianSantoso/4D-Chess-Server)

## License

Educational implementation for learning 4D spatial reasoning and chess programming.
