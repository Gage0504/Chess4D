# 4D Chess Game - Complete Guide

## Quick Start

1. Open `game.html` in your web browser
2. Click on a piece to select it (must be your turn)
3. Valid moves will be highlighted in yellow
4. Click a highlighted square to move there
5. The game tracks check, checkmate, and stalemate automatically

## Understanding the 4D Board

The board is displayed as **16 mini-boards** arranged in a **4×4 grid**:

```
┌─────────┬─────────┬─────────┬─────────┐
│  W0X0   │  W0X1   │  W0X2   │  W0X3   │
│ [4×4]   │ [4×4]   │ [4×4]   │ [4×4]   │
├─────────┼─────────┼─────────┼─────────┤
│  W1X0   │  W1X1   │  W1X2   │  W1X3   │
│ [4×4]   │ [4×4]   │ [4×4]   │ [4×4]   │
├─────────┼─────────┼─────────┼─────────┤
│  W2X0   │  W2X1   │  W2X2   │  W2X3   │
│ [4×4]   │ [4×4]   │ [4×4]   │ [4×4]   │
├─────────┼─────────┼─────────┼─────────┤
│  W3X0   │  W3X1   │  W3X2   │  W3X3   │
│ [4×4]   │ [4×4]   │ [4×4]   │ [4×4]   │
└─────────┴─────────┴─────────┴─────────┘
```

Each mini-board contains 4×4 squares with coordinates (Y, Z).

### Coordinate System

Every square has 4 coordinates: **(W, X, Y, Z)**

- **W**: Row of the mini-board grid (0-3)
- **X**: Column of the mini-board grid (0-3)  
- **Y**: Row within a mini-board (0-3)
- **Z**: Column within a mini-board (0-3)

Example: A piece at (1, 2, 0, 3) is on:
- Mini-board W1X2 (second row, third column of the grid)
- Square Y0Z3 (first row, fourth column within that mini-board)

## Initial Piece Placement

### White Pieces (starting side: Z=0 and Z=1)

**Layer Z=0** (Back row):
- Rooks: (0,0,0,0) and (0,3,0,0)
- Knights: (0,1,0,0) and (0,2,0,0)
- Bishops: (1,0,0,0) and (1,3,0,0)
- Queen: (1,1,0,0)
- King: (1,2,0,0)

**Layer Z=1** (Pawn row):
- 8 Pawns spread across (W,X,0,1) positions

### Black Pieces (starting side: Z=3 and Z=2)

**Layer Z=3** (Back row):
- Rooks: (0,0,0,3) and (0,3,0,3)
- Knights: (0,1,0,3) and (0,2,0,3)
- Bishops: (1,0,0,3) and (1,3,0,3)
- Queen: (1,1,0,3)
- King: (1,2,0,3)

**Layer Z=2** (Pawn row):
- 8 Pawns spread across (W,X,0,2) positions

## Piece Movement in Detail

### Rook ♖ - Orthogonal (1D Movement)

Moves in a straight line along **exactly one axis**:

```
From (1,1,1,1):
- W-axis: → (0,1,1,1), (2,1,1,1), (3,1,1,1)
- X-axis: → (1,0,1,1), (1,2,1,1), (1,3,1,1)
- Y-axis: → (1,1,0,1), (1,1,2,1), (1,1,3,1)
- Z-axis: → (1,1,1,0), (1,1,1,2), (1,1,1,3)
```

The rook can slide any distance along one axis until blocked.

### Bishop ♗ - Diagonal (2D Movement)

Moves diagonally by changing **exactly two coordinates equally**:

```
From (1,1,1,1):
- W+X: → (2,2,1,1), (3,3,1,1), (0,0,1,1)
- W+Y: → (2,1,2,1), (3,1,3,1), (0,1,0,1)
- W+Z: → (2,1,1,2), (3,1,1,3), (0,1,1,0)
- X+Y: → (1,2,2,1), (1,3,3,1), (1,0,0,1)
- X+Z: → (1,2,1,2), (1,3,1,3), (1,0,1,0)
- Y+Z: → (1,1,2,2), (1,1,3,3), (1,1,0,0)
```

There are 6 diagonal planes in 4D (one for each pair of dimensions).

### Queen ♕ - Combined Movement

The queen combines **rook** and **bishop** movements:
- Can move orthogonally (1 dimension changes)
- Can move diagonally (2 dimensions change equally)
- Most versatile piece

### King ♔ - One Step

Moves like a queen but **limited to 1 square**:
- Orthogonal: one step along any single axis
- Diagonal: one step along any two axes

```
From (1,1,1,1) can reach:
- Orthogonal (8 options): (0,1,1,1), (2,1,1,1), (1,0,1,1), (1,2,1,1), etc.
- Diagonal (24 options): (0,0,1,1), (2,2,1,1), (0,2,1,1), etc.
```

Cannot move into check!

### Knight ♘ - L-Shape in 4D

Moves in an **L-pattern**: 2 steps in one dimension, 1 step in another.

```
From (1,1,1,1) can reach:
- 2 in W, 1 in X: → (3,2,1,1) or (3,0,1,1)
- 2 in X, 1 in Y: → (1,3,2,1) or (1,3,0,1)
- 2 in Y, 1 in Z: → (1,1,3,2) or (1,1,3,0)
- ... and all other combinations
```

**Can jump over pieces!** This is the knight's key advantage.

### Pawn ♙ - Forward Movement

Pawns move **forward in the Z direction only**:

**White Pawns** (Z increases):
- Move: (W,X,Y,Z) → (W,X,Y,Z+1)
- Capture: (W,X,Y,Z) → (W±1,X,Y,Z+1), (W,X±1,Y,Z+1), or (W,X,Y±1,Z+1)
- Double move from starting position: Z+2

**Black Pawns** (Z decreases):
- Move: (W,X,Y,Z) → (W,X,Y,Z-1)
- Capture: (W,X,Y,Z) → (W±1,X,Y,Z-1), (W,X±1,Y,Z-1), or (W,X,Y±1,Z-1)
- Double move from starting position: Z-2

**Promotion**: When reaching Z=3 (white) or Z=0 (black), pawns promote to Queen, Rook, Bishop, or Knight.

## Game Rules

### Winning Conditions

1. **Checkmate**: Opponent's king is in check with no legal moves
2. **Stalemate**: No legal moves available but not in check (draw)

### Special Rules

- **Check**: When your king is under attack, you must:
  1. Move the king to safety, OR
  2. Block the attack, OR
  3. Capture the attacking piece

- **Cannot move into check**: Any move that puts your own king in check is illegal

- **Pawn Promotion**: Automatic when pawn reaches far edge (you choose the piece)

## Strategy Tips

### 1. Control the Center
In 4D chess, there are multiple "centers":
- Center of each mini-board
- Center of the overall grid
- Central hyperplanes

### 2. Protect Your King
Attacks can come from:
- Adjacent mini-boards (orthogonal in W/X)
- Diagonal mini-boards
- Different Y positions on same W/X board

### 3. Use Knights Effectively
Knights can:
- Jump between boards easily
- Access distant positions in fewer moves
- Ignore blocking pieces

### 4. Bishop Pairs
Each bishop can access different sets of squares based on which 2D planes it moves along. Having multiple bishops gives better coverage.

### 5. Queen Power
The queen is even more powerful in 4D:
- Can access more squares
- Can attack from more directions
- Essential for offense and defense

### 6. Pawn Structure
- Pawns only move in Z direction
- Create "layers" of defense
- Support each other from different W/X positions

## Common Patterns

### Fork (Multiple Attacks)
In 4D, a single piece can attack multiple targets from many more angles.

### Pin
Pinning works similarly but through 4D lines:
- Orthogonal pins (rook/queen along one axis)
- Diagonal pins (bishop/queen along two axes)

### Discovered Attack
Moving one piece can open up attacks from another piece along any of the 4 dimensions.

## Visual Indicators

### In the Game Interface:

- **Green highlight**: Selected piece
- **Yellow highlight with dot**: Valid move destination
- **Orange status**: Check warning
- **Red status**: Checkmate
- **Blue status**: White's turn
- **Gray status**: Black's turn

### Move History Format:
```
1. R(0,0,0,0)-(3,0,0,0)    # Rook moves from (0,0,0,0) to (3,0,0,0)
2. N(0,1,0,3)x(1,3,1,3)    # Knight captures at (1,3,1,3)
```

## Troubleshooting

### Can't select a piece?
- Make sure it's your turn
- Verify you're clicking your own pieces
- Check that the piece has legal moves

### Move not working?
- Ensure the move follows the piece's movement rules
- Check that the path is clear (except for knights)
- Verify the move doesn't leave your king in check

### Game seems stuck?
- Use the "New Game" button to restart
- Check the game status for checkmate/stalemate

## Advanced Concepts

### Dimensional Tactics
- **Orthogonal attacks**: Control along single axes
- **Diagonal attacks**: Control along diagonal planes
- **Hyperdiagonal**: Coordinated attacks using 3 or more pieces

### Opening Principles
1. Develop pieces from starting boards
2. Control key mini-boards
3. Protect king from multi-dimensional attacks
4. Don't move the same piece twice early on

### Endgame
- King becomes more active in 4D
- Pawns closer to promotion squares are valuable
- Rooks and queens dominate open boards

---

**Practice makes perfect! The more you play, the better you'll understand 4D spatial relationships.**
