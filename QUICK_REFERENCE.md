# 4D Chess Quick Reference

## Board Layout
```
16 mini-boards in 4×4 grid
Each mini-board: 4×4 squares
Total: 256 squares (4×4×4×4)
```

## Coordinates
Every square: `(W, X, Y, Z)` where each is 0-3
- `W, X`: Which mini-board (row, column)
- `Y, Z`: Which square in that mini-board

## Piece Symbols
| White | Black | Name   |
|-------|-------|--------|
| ♔     | ♚     | King   |
| ♕     | ♛     | Queen  |
| ♖     | ♜     | Rook   |
| ♗     | ♝     | Bishop |
| ♘     | ♞     | Knight |
| ♙     | ♟     | Pawn   |

## Movement Summary

### ♖ Rook
- **1D movement**: One dimension changes
- Example: (1,1,1,1) → (1,1,1,3)
- 8 directions total

### ♗ Bishop
- **2D movement**: Two dimensions change equally
- Example: (1,1,1,1) → (2,2,1,1)
- 24 directions total

### ♕ Queen
- **1D + 2D**: Rook + Bishop
- 32 directions total

### ♔ King
- Like Queen, **1 step only**
- 32 directions, max distance 1

### ♘ Knight
- **L-shape**: 2 steps in one dim, 1 in another
- Example: (1,1,1,1) → (3,2,1,1)
- Can jump over pieces
- 48 possible moves

### ♙ Pawn
- **Forward**: +Z (white) or -Z (black)
- **Capture**: Forward + sideways in W, X, or Y
- **Double move** from start
- **Promotes** at far edge (Z=3 or Z=0)

## Game Rules

### Turn Order
1. White moves first
2. Alternate turns
3. Must move when it's your turn

### Check
- King is under attack
- Must escape check on next move

### Checkmate
- King in check with no escape
- Attacker wins

### Stalemate
- No legal moves but not in check
- Game is a draw

## Controls

| Action | How |
|--------|-----|
| Select piece | Click your piece |
| See valid moves | Yellow highlights |
| Make move | Click highlighted square |
| Deselect | Click selected piece again |
| New game | Click "New Game" button |

## Visual Indicators

| Color | Meaning |
|-------|---------|
| Green | Selected piece |
| Yellow | Valid move |
| Orange | Check warning |
| Red | Checkmate |
| Blue | White's turn |
| Gray | Black's turn |

## Starting Position

### White (Z=0, Z=1)
```
Z=0 (back): Rooks, Knights, Bishops, Queen, King
Z=1 (front): 8 Pawns
```

### Black (Z=3, Z=2)
```
Z=3 (back): Rooks, Knights, Bishops, Queen, King
Z=2 (front): 8 Pawns
```

## Strategy Tips

1. **Control center** mini-boards
2. **Protect king** from multiple angles
3. **Use knights** for jumping attacks
4. **Develop pieces** early
5. **Think in 4D** - attacks come from more directions

## Common Mistakes

❌ Forgetting knights can jump  
❌ Not checking all attack angles  
❌ Moving into check  
❌ Leaving pieces undefended  
❌ Ignoring pawn promotion opportunities  

## Files to Open

- **Play Game**: `game.html`
- **3D Viewer**: `index.html`
- **Full Rules**: `README.md`
- **Strategy Guide**: `GAME_GUIDE.md`
- **Tech Details**: `IMPLEMENTATION.md`

---

**Have fun exploring chess in 4 dimensions! 🎮♔**
