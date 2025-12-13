/**
 * main.js
 * Initialize and run the 4D Chess game
 */

let game;
let ui;

// Initialize the game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('Initializing 4D Chess Game...');
    
    // Create game instance
    game = new ChessGame();
    
    // Create UI instance
    ui = new ChessUI(game);
    
    // Initialize the UI
    ui.initialize();
    
    console.log('4D Chess Game initialized successfully!');
    console.log('Current player:', game.currentPlayer);
});
