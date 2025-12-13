# 4D Chess Game

A fully playable 4D chess variant implemented in JavaScript with an interactive HTML/CSS interface. This game extends traditional chess pieces into four-dimensional space, creating a unique and challenging chess experience.

[Try the 4D Chess Viewer](https://gage0504.github.io/chess4d/)

[Play the 4D Chess Game](https://gage0504.github.io/chess4d/game.html)

## Overview

This implementation features:
- **Complete 4D chess game** with standard chess pieces only
- **256 square board** (4×4×4×4 grid)
- **Visual interface** showing 16 mini-boards in a 4×4 grid
- **Full game logic** including check, checkmate, and stalemate detection
- **Interactive UI** with move highlighting and piece selection
- **Turn-based gameplay** with move history tracking

## Board Structure

### 4D Grid
- **Total squares**: 4×4×4×4 = 256 cells
- **Visual layout**: 16 mini-boards arranged in a 4×4 grid
  - Each mini-board represents coordinates (W, X)
  - Each square within a mini-board is at position (Y, Z)

### Coordinate System
Four-dimensional coordinates: `(w, x, y, z)`
- `w` and `x` (0-3): Determine which mini-board (row and column in the grid)
- `y` and `z` (0-3): Determine position within each mini-board
- All coordinates range from 0 to 3

## How to Play

### Controls
1. **Click a piece** to select it (must be your color and your turn)
2. **Valid moves** are highlighted in yellow
3. **Click a highlighted square** to move your piece there
4. **Click the selected piece again** to deselect it
5. Use the **New Game** button to reset the board

### Starting Position
Each player has standard chess pieces:
- 1 King
- 1 Queen  
- 2 Rooks
- 2 Bishops
- 2 Knights
- 8 Pawns

White pieces start at z=0 and z=1 layers, black pieces at z=3 and z=2 layers.

## Piece Movement in 4D

### ♖ Rook (Orthogonal Movement)
- Moves in **straight lines along one dimension at a time**
- Can change only W, X, Y, or Z (not multiple simultaneously)
- Examples:
  - (0,0,0,0) → (3,0,0,0) — moving along W axis
  - (1,1,1,1) → (1,1,1,3) — moving along Z axis
- Cannot jump over pieces

### ♗ Bishop (Diagonal Movement)
- Moves **diagonally in exactly two dimensions at once**
- Both dimensions change at equal rates
- Examples:
  - (0,0,0,0) → (2,2,0,0) — diagonal in W-X plane
  - (0,0,0,0) → (2,0,2,0) — diagonal in W-Y plane
  - (1,1,1,1) → (3,3,1,1) — diagonal in W-X plane
- Cannot jump over pieces

### ♕ Queen
- **Combines rook and bishop movement**
- Can move orthogonally (1 dimension) or diagonally (2 dimensions)
- Most powerful piece
- Cannot jump over pieces

### ♔ King
- Moves like the queen but **only one step**
- Can move in any orthogonal or diagonal direction
- Limited to distance of 1 in each dimension that changes
- Cannot move into check

### ♘ Knight
- **L-shaped move in 4D**: 2 steps in one dimension, 1 step in another
- Examples:
  - (0,0,0,0) → (2,1,0,0) — 2 in W, 1 in X
  - (0,0,0,0) → (0,2,0,1) — 2 in X, 1 in Z
  - (1,1,1,1) → (1,3,0,1) — 2 in X, 1 in Y
- **Can jump over other pieces**

### ♟ Pawn
- Moves **forward one step in the Z direction**
  - White pawns: +Z direction (z increases)
  - Black pawns: -Z direction (z decreases)
- **Captures diagonally**: forward in Z and sideways in one other dimension (W, X, or Y)
- **Double move** from starting position (2 squares forward)
- **Promotion**: When reaching the opposite edge (z=3 for white, z=0 for black), promotes to Queen, Rook, Bishop, or Knight

## Game Rules

### Objective
Checkmate your opponent's king (attack it with no legal escape moves).

### Turn Order
1. White moves first
2. Players alternate turns
3. Must move on your turn (passing not allowed)

### Check and Checkmate
- **Check**: King is under attack and must move out of danger
- **Checkmate**: King is in check with no legal moves to escape
- **Stalemate**: No legal moves available but not in check (draw)

### Special Rules
- Cannot move into check
- Cannot move if it leaves your king in check
- Pawn promotion occurs automatically when reaching the far edge

## Game Interface

### Main Display
- **16 Mini-Boards**: Arranged in 4×4 grid, labeled with (W,X) coordinates
- **Board Labels**: Each mini-board shows its W and X coordinates
- **Piece Symbols**: Unicode chess symbols (♔♕♖♗♘♙ for white, ♚♛♜♝♞♟ for black)

### Game Information
- **Status Display**: Shows current player, check warnings, and game result
- **Captured Pieces**: Shows pieces captured by each player
- **Move History**: Complete list of all moves in the game
- **Piece Guide**: Reference for how each piece moves

### Visual Feedback
- **Selected Piece**: Highlighted in green
- **Valid Moves**: Highlighted in yellow with dots
- **Check Warning**: Orange background on status
- **Checkmate**: Red background on status

## Files Structure

```
Chess4D/
├── game.html              # Main game interface
├── index.html             # 3D visualization viewer
├── css/
│   ├── game-style.css    # Game styling
│   └── ...               # Other styles
├── js/
│   ├── board.js          # 4D board representation
│   ├── pieces.js         # Piece classes and movement logic
│   ├── game.js           # Game engine and rules
│   ├── ui.js             # UI interaction handlers
│   ├── main.js           # Game initialization
│   └── ...               # Other scripts
├── models/               # 3D models for visualization
└── README.md            # This file
```

## Technical Details

### Browser Compatibility
- Pure JavaScript (ES6+)
- No external dependencies for core game functionality
- Works in modern browsers (Chrome, Firefox, Safari, Edge)

### Implementation
- Object-oriented design with separate classes for pieces, board, and game logic
- 4D coordinate system using (w, x, y, z) tuples
- Move validation ensures all chess rules are followed
- Check/checkmate detection scans all possible moves
- Deep board cloning for move simulation

## Strategy Tips

1. **Think in 4D**: Pieces can attack from directions you might not expect
2. **Control the center**: Multiple boards mean multiple centers to control
3. **Protect your king**: Threats can come from many more directions than 2D chess
4. **Use knights effectively**: Their jumping ability is even more powerful in 4D
5. **Coordinate between boards**: Pieces on different (W,X) boards can support each other

## Credits

- Reference implementation: [BrianSantoso/4D-Chess](https://github.com/BrianSantoso/4D-Chess)
- Inspired by: [4D Chess Server](https://github.com/BrianSantoso/4D-Chess-Server)
- Live demo reference: https://chess4d.herokuapp.com/sandbox

## License

This is an educational implementation of 4D chess. Feel free to use and modify for learning purposes.

---

**Enjoy playing chess in four dimensions! ♔♕♖♗♘♙**
