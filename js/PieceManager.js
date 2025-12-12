/**
 * PieceManager.js
 * Dynamically manages chess pieces in 4D space
 */

class PieceManager {
    constructor(scene, boardManager, settings) {
        this.scene = scene;
        this.boardManager = boardManager;
        this.settings = settings;
        this.pieces = [];
        this.piecesGroup = new THREE.Group();
        this.piecesGroup.name = 'piecesGroup';
        this.scene.add(this.piecesGroup);
    }
    
    addPiece(type, position, color) {
        const piece = this.createPiece(type, color);
        const worldPos = this.boardCoordinates(position);
        piece.position.copy(worldPos);
        
        const pieceData = {
            id: this.pieces.length,
            type: type,
            color: color,
            position: position,
            mesh: piece
        };
        
        this.pieces.push(pieceData);
        this.piecesGroup.add(piece);
        
        return pieceData;
    }
    
    removePiece(pieceId) {
        const piece = this.pieces[pieceId];
        if (piece) {
            this.piecesGroup.remove(piece.mesh);
            this.pieces[pieceId] = null;
        }
    }
    
    movePiece(pieceId, newPosition) {
        const piece = this.pieces[pieceId];
        if (piece) {
            piece.position = newPosition;
            const worldPos = this.boardCoordinates(newPosition);
            piece.mesh.position.copy(worldPos);
        }
    }
    
    createPiece(type, color) {
        let geometry;
        
        switch(type) {
            case 'sphere':
                geometry = new THREE.SphereGeometry(this.settings.pieceSize, 16, 16);
                break;
            case 'cylinder':
                geometry = new THREE.CylinderGeometry(this.settings.pieceSize, this.settings.pieceSize, this.settings.pieceSize * 2, 16);
                break;
            case 'cone':
                geometry = new THREE.ConeGeometry(this.settings.pieceSize, this.settings.pieceSize * 2, 16);
                break;
            case 'box':
                geometry = new THREE.BoxGeometry(this.settings.pieceSize * 1.5, this.settings.pieceSize * 1.5, this.settings.pieceSize * 1.5);
                break;
            default:
                geometry = new THREE.SphereGeometry(this.settings.pieceSize, 16, 16);
        }
        
        const material = new THREE.MeshPhongMaterial({
            color: new THREE.Color(color),
            shininess: 100
        });
        
        return new THREE.Mesh(geometry, material);
    }
    
    boardCoordinates(position) {
        const { x, y, z, w } = position;
        const boardSize = 8;
        
        return new THREE.Vector3(
            x - 4 + 0.5,
            y - 4 + 0.5,
            z - 4 + 0.5 + w * (boardSize + this.settings.spacing)
        );
    }
    
    updatePieceSize(size) {
        this.settings.pieceSize = size;
        // Update all existing pieces
        this.pieces.forEach(pieceData => {
            if (pieceData && pieceData.mesh) {
                pieceData.mesh.scale.set(size / 0.3, size / 0.3, size / 0.3);
            }
        });
    }
    
    updatePieceColors(whiteColor, blackColor) {
        this.settings.whitePieceColor = whiteColor;
        this.settings.blackPieceColor = blackColor;
        
        this.pieces.forEach(pieceData => {
            if (pieceData && pieceData.mesh) {
                const color = pieceData.color === 'white' ? whiteColor : blackColor;
                pieceData.mesh.material.color = new THREE.Color(color);
            }
        });
    }
    
    clearPieces() {
        this.pieces.forEach(pieceData => {
            if (pieceData && pieceData.mesh) {
                this.piecesGroup.remove(pieceData.mesh);
            }
        });
        this.pieces = [];
    }
    
    loadDefaultSetup() {
        // Clear existing pieces
        this.clearPieces();
        
        // Sample pieces positions (simplified chess setup)
        const defaultPieces = [
            // White pieces (w=0, z=0)
            { x: 0, y: 0, z: 0, w: 0, color: 'white' },
            { x: 7, y: 0, z: 0, w: 0, color: 'white' },
            { x: 1, y: 1, z: 0, w: 0, color: 'white' },
            { x: 6, y: 1, z: 0, w: 0, color: 'white' },
            // Black pieces (w=0, z=7)
            { x: 0, y: 0, z: 7, w: 0, color: 'black' },
            { x: 7, y: 0, z: 7, w: 0, color: 'black' },
            { x: 1, y: 1, z: 7, w: 0, color: 'black' },
            { x: 6, y: 1, z: 7, w: 0, color: 'black' }
        ];
        
        // Add pieces from other dimensions if layers exist
        if (this.settings.wLayers >= 2) {
            defaultPieces.push({ x: 3, y: 3, z: 3, w: 1, color: 'white' });
        }
        if (this.settings.wLayers >= 3) {
            defaultPieces.push({ x: 4, y: 4, z: 4, w: 2, color: 'black' });
        }
        
        defaultPieces.forEach(piece => {
            this.addPiece(
                this.settings.pieceStyle,
                { x: piece.x, y: piece.y, z: piece.z, w: piece.w },
                piece.color === 'white' ? this.settings.whitePieceColor : this.settings.blackPieceColor
            );
        });
    }
}