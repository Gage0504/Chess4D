/**
 * BoardManager.js
 * Manages multiple 4D board layers with individual opacity controls
 */

class BoardManager {
    constructor(scene, settings) {
        this.scene = scene;
        this.boards = [];
        this. boardGroups = [];
        this.settings = settings;
    }
    
    createBoards(numLayers) {
        this.clearBoards();
        for (let w = 0; w < numLayers; w++) {
            const opacity = this.settings.boardOpacities[w] || 0.8;
            this.addBoard(w, opacity);
        }
    }
    
    addBoard(wIndex, opacity = 0.8) {
        const boardGroup = new THREE.Group();
        boardGroup.name = `board_w${wIndex}`;
        const boardSize = 8;
        const squareSize = 1;
        
        for (let z = 0; z < boardSize; z++) {
            for (let y = 0; y < boardSize; y++) {
                for (let x = 0; x < boardSize; x++) {
                    const isLight = (x + y + z + wIndex) % 2 === 0;
                    const color = new THREE.Color(isLight ? this. settings.lightColor : this.settings.darkColor);
                    
                    const geometry = new THREE. BoxGeometry(squareSize * 0.95, squareSize * 0.95, squareSize * 0.95);
                    const material = new THREE. MeshPhongMaterial({
                        color: color,
                        transparent: true,
                        opacity: opacity,
                        shininess: 30
                    });
                    
                    const cube = new THREE.Mesh(geometry, material);
                    cube. position.set(
                        x - boardSize / 2 + 0.5,
                        y - boardSize / 2 + 0.5,
                        z - boardSize / 2 + 0.5 + wIndex * (boardSize + this.settings.spacing)
                    );
                    
                    cube.userData = {
                        boardCoords: { x, y, z, w: wIndex },
                        isLight: isLight
                    };
                    
                    boardGroup.add(cube);
                }
            }
        }
        
        this.boardGroups[wIndex] = boardGroup;
        this.scene. add(boardGroup);
        return boardGroup;
    }
    
    removeBoard(wIndex) {
        if (this.boardGroups[wIndex]) {
            this.scene.remove(this.boardGroups[wIndex]);
            this.boardGroups[wIndex] = null;
        }
    }
    
    setBoardOpacity(wIndex, opacity) {
        const boardGroup = this.boardGroups[wIndex];
        if (boardGroup) {
            boardGroup.children.forEach(cube => {
                cube.material.opacity = opacity;
            });
        }
    }
    
    updateBoardColors(lightColor, darkColor) {
        this.settings.lightColor = lightColor;
        this.settings.darkColor = darkColor;
        
        this.boardGroups.forEach((boardGroup) => {
            if (boardGroup) {
                boardGroup.children.forEach(cube => {
                    const isLight = cube.userData.isLight;
                    const color = new THREE.Color(isLight ? lightColor : darkColor);
                    cube.material.color = color;
                });
            }
        });
    }
    
    updateSpacing(spacing) {
        this.settings.spacing = spacing;
        const boardSize = 8;
        
        this.boardGroups.forEach((boardGroup) => {
            if (boardGroup) {
                boardGroup.children. forEach(cube => {
                    const { x, y, z, w } = cube.userData.boardCoords;
                    cube. position.set(
                        x - boardSize / 2 + 0.5,
                        y - boardSize / 2 + 0.5,
                        z - boardSize / 2 + 0.5 + w * (boardSize + spacing)
                    );
                });
            }
        });
    }
    
    clearBoards() {
        this.boardGroups.forEach(boardGroup => {
            if (boardGroup) {
                this.scene.remove(boardGroup);
            }
        });
        this.boardGroups = [];
    }
}
