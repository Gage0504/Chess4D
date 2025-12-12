/**
 * app.js
 * Main application logic with individual board opacity controls
 */

let scene, camera, renderer, controls;
let boardManager, pieceManager;
let animationId;

let settings = {
    lightColor: '#f0d9b5',
    darkColor: '#b58863',
    boardOpacities: [0.8, 0.8, 0.8, 0.8, 0.8],
    spacing: 2. 5,
    wLayers: 3,
    whitePieceColor: '#ffffff',
    blackPieceColor: '#333333',
    pieceStyle: 'sphere',
    pieceSize: 0.3,
    rotationSpeed: 0.5
};

function init() {
    const container = document.getElementById('canvas-container');

    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x1a1a2e);

    camera = new THREE.PerspectiveCamera(
        75,
        container.clientWidth / container.clientHeight,
        0.1,
        1000
    );
    camera.position.set(15, 15, 15);

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);

    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minDistance = 5;
    controls.maxDistance = 50;

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const directionalLight1 = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight1.position.set(10, 10, 10);
    scene.add(directionalLight1);

    const directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.4);
    directionalLight2.position.set(-10, -10, -10);
    scene.add(directionalLight2);

    boardManager = new BoardManager(scene, settings);
    pieceManager = new PieceManager(scene, boardManager, settings);
    
    boardManager.createBoards(settings. wLayers);
    pieceManager.loadDefaultSetup();

    window.addEventListener('resize', onWindowResize);
    setupControls();

    animate();
}

function animate() {
    animationId = requestAnimationFrame(animate);

    if (settings.rotationSpeed > 0 && boardManager.boardGroups.length > 0) {
        boardManager.boardGroups.forEach(group => {
            if (group) {
                group. rotation.y += settings.rotationSpeed * 0.001;
            }
        });
        if (pieceManager.piecesGroup) {
            pieceManager. piecesGroup.rotation.y += settings.rotationSpeed * 0.001;
        }
    }

    controls.update();
    renderer.render(scene, camera);
}

function onWindowResize() {
    const container = document.getElementById('canvas-container');
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
}

function setupControls() {
    document.getElementById('lightColor').addEventListener('input', (e) => {
        settings.lightColor = e.target.value;
        boardManager.updateBoardColors(settings.lightColor, settings.darkColor);
    });

    document.getElementById('darkColor').addEventListener('input', (e) => {
        settings.darkColor = e.target.value;
        boardManager. updateBoardColors(settings.lightColor, settings.darkColor);
    });

    document.getElementById('spacing').addEventListener('input', (e) => {
        settings.spacing = parseFloat(e.target. value);
        document.getElementById('spacingValue').textContent = settings.spacing. toFixed(1);
        boardManager.updateSpacing(settings.spacing);
        pieceManager.loadDefaultSetup();
    });

    document.getElementById('wLayers').addEventListener('input', (e) => {
        settings.wLayers = parseInt(e.target. value);
        document.getElementById('wLayersValue').textContent = settings.wLayers;
        boardManager.createBoards(settings.wLayers);
        pieceManager.loadDefaultSetup();
        updateBoardOpacityControls();
    });

    document.getElementById('whitePieceColor').addEventListener('input', (e) => {
        settings.whitePieceColor = e.target.value;
        pieceManager.updatePieceColors(settings.whitePieceColor, settings.blackPieceColor);
    });

    document.getElementById('blackPieceColor').addEventListener('input', (e) => {
        settings.blackPieceColor = e.target.value;
        pieceManager.updatePieceColors(settings.whitePieceColor, settings.blackPieceColor);
    });

    document.getElementById('pieceStyle').addEventListener('change', (e) => {
        settings.pieceStyle = e.target.value;
        pieceManager.loadDefaultSetup();
    });

    document.getElementById('pieceSize').addEventListener('input', (e) => {
        settings.pieceSize = parseFloat(e.target. value);
        document.getElementById('pieceSizeValue').textContent = settings.pieceSize.toFixed(2);
        pieceManager.updatePieceSize(settings.pieceSize);
    });

    document.getElementById('rotation').addEventListener('input', (e) => {
        settings.rotationSpeed = parseFloat(e.target.value);
        document.getElementById('rotationValue').textContent = settings.rotationSpeed. toFixed(1);
    });

    document.getElementById('resetBtn').addEventListener('click', () => {
        camera.position.set(15, 15, 15);
        controls.target.set(0, 0, 0);
        controls.update();
    });

    document.getElementById('randomizeBtn').addEventListener('click', () => {
        pieceManager.clearPieces();
        const numPieces = Math.floor(Math.random() * 10) + 5;
        for (let i = 0; i < numPieces; i++) {
            pieceManager.addPiece(
                settings.pieceStyle,
                {
                    x: Math.floor(Math.random() * 8),
                    y: Math. floor(Math.random() * 8),
                    z: Math.floor(Math.random() * 8),
                    w:  Math.floor(Math.random() * settings.wLayers)
                },
                Math.random() > 0.5 ? settings.whitePieceColor : settings.blackPieceColor
            );
        }
    });
    
    updateBoardOpacityControls();
}

function updateBoardOpacityControls() {
    const container = document.getElementById('board-opacity-controls');
    container.innerHTML = '';
    
    for (let i = 0; i < settings.wLayers; i++) {
        const controlGroup = document.createElement('div');
        controlGroup.className = 'control-group';
        
        const label = document.createElement('label');
        const valueSpan = document.createElement('span');
        valueSpan.className = 'value-display';
        valueSpan.id = `board${i}OpacityValue`;
        valueSpan.textContent = (settings.boardOpacities[i] || 0.8).toFixed(1);
        label.innerHTML = `Board ${i + 1} Opacity `;
        label.appendChild(valueSpan);
        
        const slider = document.createElement('input');
        slider.type = 'range';
        slider. id = `board${i}Opacity`;
        slider.min = '0.1';
        slider.max = '1';
        slider.step = '0.1';
        slider.value = settings.boardOpacities[i] || 0.8;
        
        slider.addEventListener('input', (e) => {
            const opacity = parseFloat(e.target. value);
            settings.boardOpacities[i] = opacity;
            boardManager.setBoardOpacity(i, opacity);
            valueSpan.textContent = opacity.toFixed(1);
        });
        
        controlGroup. appendChild(label);
        controlGroup.appendChild(slider);
        container.appendChild(controlGroup);
    }
}

window.addEventListener('DOMContentLoaded', init);
