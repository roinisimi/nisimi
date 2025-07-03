document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('game-canvas');
    const ctx = canvas.getContext('2d');
    const startButton = document.getElementById('start-game');
    const scoreValue = document.getElementById('score-value');
    const levelValue = document.getElementById('level-value');
    const livesValue = document.getElementById('lives-value');
    
    // Game constants
    const CELL_SIZE = 30;
    const GRID_SIZE = 15;
    canvas.width = CELL_SIZE * GRID_SIZE;
    canvas.height = CELL_SIZE * GRID_SIZE;
    
    // Game state
    let gameState = {
        isActive: false,
        score: 0,
        level: 1,
        lives: 3,
        playerPos: { x: 1, y: 1 },
        coins: [],
        honeypots: [],
        portals: [],
        maze: [],
        animationFrame: null
    };

    // Maze generation using recursive backtracking
    function generateMaze() {
        const maze = Array(GRID_SIZE).fill().map(() => Array(GRID_SIZE).fill(1));
        
        function carve(x, y) {
            maze[y][x] = 0;
            
            const directions = [
                [0, -2], // Up
                [2, 0],  // Right
                [0, 2],  // Down
                [-2, 0]  // Left
            ].sort(() => Math.random() - 0.5);
            
            for (const [dx, dy] of directions) {
                const newX = x + dx;
                const newY = y + dy;
                
                if (newX > 0 && newX < GRID_SIZE - 1 && newY > 0 && newY < GRID_SIZE - 1 && maze[newY][newX] === 1) {
                    maze[y + dy/2][x + dx/2] = 0;
                    carve(newX, newY);
                }
            }
        }
        
        carve(1, 1);
        return maze;
    }

    // Place items randomly in valid positions
    function placeItems() {
        const items = [];
        const numCoins = 5 + gameState.level;
        const numHoneypots = Math.min(3 + Math.floor(gameState.level / 2), 8);
        const numPortals = Math.min(2 + Math.floor(gameState.level / 3), 6);
        
        function getRandomEmptyCell() {
            let x, y;
            do {
                x = Math.floor(Math.random() * (GRID_SIZE - 2)) + 1;
                y = Math.floor(Math.random() * (GRID_SIZE - 2)) + 1;
            } while (
                gameState.maze[y][x] === 1 || 
                (x === gameState.playerPos.x && y === gameState.playerPos.y) ||
                items.some(item => item.x === x && item.y === y)
            );
            return { x, y };
        }
        
        // Place coins
        for (let i = 0; i < numCoins; i++) {
            const pos = getRandomEmptyCell();
            items.push({ type: 'coin', ...pos });
        }
        
        // Place honeypots
        for (let i = 0; i < numHoneypots; i++) {
            const pos = getRandomEmptyCell();
            items.push({ type: 'honeypot', ...pos });
        }
        
        // Place portals
        for (let i = 0; i < numPortals; i++) {
            const pos = getRandomEmptyCell();
            items.push({ type: 'portal', ...pos });
        }
        
        return items;
    }

    function drawMaze() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw walls
        for (let y = 0; y < GRID_SIZE; y++) {
            for (let x = 0; x < GRID_SIZE; x++) {
                if (gameState.maze[y][x] === 1) {
                    ctx.fillStyle = '#2c3e50';
                    ctx.fillRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
                }
            }
        }
        
        // Draw items
        const items = [...gameState.coins, ...gameState.honeypots, ...gameState.portals];
        items.forEach(item => {
            ctx.font = `${CELL_SIZE * 0.8}px Arial`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            const emoji = item.type === 'coin' ? '💰' : item.type === 'honeypot' ? '🍯' : '🌀';
            ctx.fillText(emoji, item.x * CELL_SIZE + CELL_SIZE/2, item.y * CELL_SIZE + CELL_SIZE/2);
        });
        
        // Draw player
        ctx.font = `${CELL_SIZE * 0.8}px Arial`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('🤠', gameState.playerPos.x * CELL_SIZE + CELL_SIZE/2, gameState.playerPos.y * CELL_SIZE + CELL_SIZE/2);
    }

    function checkCollisions() {
        const { x, y } = gameState.playerPos;
        
        // Check coin collection
        const coinIndex = gameState.coins.findIndex(coin => coin.x === x && coin.y === y);
        if (coinIndex !== -1) {
            gameState.coins.splice(coinIndex, 1);
            gameState.score += 10;
            scoreValue.textContent = gameState.score;
            
            // Level complete
            if (gameState.coins.length === 0) {
                nextLevel();
            }
        }
        
        // Check honeypot collision
        const hitHoneypot = gameState.honeypots.some(pot => pot.x === x && pot.y === y);
        if (hitHoneypot) {
            loseLife('Ouch! You hit a honeypot trap!');
        }
        
        // Check portal collision
        const hitPortal = gameState.portals.some(portal => portal.x === x && portal.y === y);
        if (hitPortal) {
            loseLife('You got caught in a reverse shell portal!');
        }
    }

    function loseLife(message) {
        gameState.lives--;
        livesValue.textContent = gameState.lives;
        
        if (gameState.lives <= 0) {
            endGame();
            alert(`Game Over! ${message}\nFinal Score: ${gameState.score}`);
        } else {
            alert(message);
            resetPlayerPosition();
        }
    }

    function resetPlayerPosition() {
        gameState.playerPos = { x: 1, y: 1 };
    }

    function nextLevel() {
        gameState.level++;
        levelValue.textContent = gameState.level;
        initializeLevel();
        alert(`Level ${gameState.level}! Watch out for more traps!`);
    }

    function initializeLevel() {
        gameState.maze = generateMaze();
        resetPlayerPosition();
        
        const items = placeItems();
        gameState.coins = items.filter(item => item.type === 'coin');
        gameState.honeypots = items.filter(item => item.type === 'honeypot');
        gameState.portals = items.filter(item => item.type === 'portal');
    }

    function startGame() {
        gameState = {
            isActive: true,
            score: 0,
            level: 1,
            lives: 3,
            playerPos: { x: 1, y: 1 },
            coins: [],
            honeypots: [],
            portals: [],
            maze: [],
            animationFrame: null
        };
        
        scoreValue.textContent = gameState.score;
        levelValue.textContent = gameState.level;
        livesValue.textContent = gameState.lives;
        
        startButton.textContent = 'Game in Progress';
        startButton.disabled = true;
        
        initializeLevel();
        gameLoop();
        
        // Show mobile controls on touch devices
        if ('ontouchstart' in window) {
            document.getElementById('mobile-controls').classList.remove('hidden');
        }
    }

    function endGame() {
        gameState.isActive = false;
        startButton.textContent = 'Start New Game';
        startButton.disabled = false;
        cancelAnimationFrame(gameState.animationFrame);
        document.getElementById('mobile-controls').classList.add('hidden');
    }

    function gameLoop() {
        if (!gameState.isActive) return;
        
        drawMaze();
        gameState.animationFrame = requestAnimationFrame(gameLoop);
    }

    function handleMovement(dx, dy) {
        if (!gameState.isActive) return;
        
        const newX = gameState.playerPos.x + dx;
        const newY = gameState.playerPos.y + dy;
        
        // Check if the new position is valid (not a wall)
        if (newX >= 0 && newX < GRID_SIZE && newY >= 0 && newY < GRID_SIZE && gameState.maze[newY][newX] === 0) {
            gameState.playerPos.x = newX;
            gameState.playerPos.y = newY;
            checkCollisions();
        }
    }

    // Event listeners
    startButton.addEventListener('click', startGame);
    
    // Keyboard controls
    document.addEventListener('keydown', (e) => {
        if (!gameState.isActive) return;
        
        switch (e.key) {
            case 'ArrowUp':
                handleMovement(0, -1);
                break;
            case 'ArrowRight':
                handleMovement(1, 0);
                break;
            case 'ArrowDown':
                handleMovement(0, 1);
                break;
            case 'ArrowLeft':
                handleMovement(-1, 0);
                break;
        }
    });
    
    // Mobile controls
    document.getElementById('up').addEventListener('click', () => handleMovement(0, -1));
    document.getElementById('right').addEventListener('click', () => handleMovement(1, 0));
    document.getElementById('down').addEventListener('click', () => handleMovement(0, 1));
    document.getElementById('left').addEventListener('click', () => handleMovement(-1, 0));
}); 