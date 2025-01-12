// Contraseña específica para este juego
const correctPassword = "MEGUSTAchuparTUPITO01";

// Referencias a elementos HTML
const passwordScreen = document.getElementById("password-screen");
const passwordInput = document.getElementById("password");
const errorMessage = document.getElementById("error-message");
const gameContainer = document.getElementById("game-container");

// Función para verificar la contraseña
function checkPassword() {
    if (passwordInput.value === correctPassword) {
        // Ocultar pantalla de contraseña y mostrar el juego
        passwordScreen.classList.add("hidden");
        gameContainer.classList.remove("hidden");
    } else {
        // Mostrar mensaje de error si la contraseña es incorrecta
        errorMessage.classList.remove("hidden");
    }
}

// Continuación del código del juego
const mazeContainer = document.getElementById("maze-container");
const startButton = document.getElementById("start-button");
const resetButton = document.getElementById("reset-button");
const messageElement = document.getElementById("message");
const countdownElement = document.getElementById("countdown");
const timeElement = document.getElementById("current-time");

const allowTesting = true;
const targetDate = new Date(new Date().getFullYear(), 11, 25, 17, 0, 0);
const endDate = new Date(new Date().getFullYear(), 11, 25, 18, 0, 0);

let maze = [
    [" ", "W", "W", "W", "W", "W"],
    [" ", " ", " ", "W", " ", " "],
    ["W", "W", " ", "W", " ", "W"],
    ["W", " ", " ", " ", " ", "W"],
    ["W", " ", "W", "W", " ", "W"],
    ["W", "W", "W", " ", " ", "G"],
];

let playerPosition = { row: 0, col: 0 };

function isGameAvailable() {
    const now = new Date();
    return allowTesting || (now >= targetDate && now < endDate);
}

function renderMaze() {
    mazeContainer.innerHTML = "";
    maze.forEach((row, rowIndex) => {
        row.forEach((cell, colIndex) => {
            const cellDiv = document.createElement("div");
            cellDiv.classList.add("cell");
            if (cell === "W") {
                cellDiv.classList.add("wall");
            } else if (cell === "G") {
                cellDiv.classList.add("goal");
            }
            mazeContainer.appendChild(cellDiv);
        });
    });

    const player = document.createElement("div");
    player.id = "player";
    mazeContainer.appendChild(player);
    updatePlayerPosition();
}

function updatePlayerPosition() {
    const player = document.getElementById("player");
    const cellSize = 50;
    player.style.top = `${playerPosition.row * cellSize}px`;
    player.style.left = `${playerPosition.col * cellSize}px`;
}

function movePlayer(direction) {
    const { row, col } = playerPosition;
    let newRow = row;
    let newCol = col;

    if (direction === "up") newRow--;
    if (direction === "down") newRow++;
    if (direction === "left") newCol--;
    if (direction === "right") newCol++;

    if (
        newRow >= 0 &&
        newRow < maze.length &&
        newCol >= 0 &&
        newCol < maze[0].length &&
        maze[newRow][newCol] !== "W"
    ) {
        playerPosition = { row: newRow, col: newCol };
        updatePlayerPosition();
        checkWin();
    }
}

function checkWin() {
    const { row, col } = playerPosition;
    if (maze[row][col] === "G") {
        messageElement.textContent = "🎉 ¡Ganaste! Contraseña: TEqUIEROentodosLosUNIVERSOs.";
        document.removeEventListener("keydown", handleKeyPress);
    }
}

function handleKeyPress(e) {
    if (e.key === "ArrowUp") movePlayer("up");
    if (e.key === "ArrowDown") movePlayer("down");
    if (e.key === "ArrowLeft") movePlayer("left");
    if (e.key === "ArrowRight") movePlayer("right");
}

function startGame() {
    if (!isGameAvailable()) {
        messageElement.textContent =
            "⛔ El juego solo está disponible entre las 17:00 y las 18:00 del 25 de diciembre.";
        return;
    }
    messageElement.textContent = "";
    playerPosition = { row: 0, col: 0 };
    renderMaze();
    document.addEventListener("keydown", handleKeyPress);
    resetButton.disabled = false;
}

function updateAvailabilityCountdown() {
    const now = new Date();
    const timeLeft = targetDate - now;

    if (isGameAvailable()) {
        countdownElement.textContent = "✅ El juego está disponible.";
        startButton.disabled = false;
        clearInterval(availabilityTimer);
    } else if (timeLeft > 0) {
        const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

        countdownElement.textContent = `⏳ Disponible en: ${days}d ${hours}h ${minutes}m ${seconds}s`;
        startButton.disabled = true;
    } else {
        countdownElement.textContent = "❌ Fuera del horario permitido.";
        startButton.disabled = true;
    }
}

function updateTime() {
    const now = new Date();
    timeElement.textContent = `Hora actual: ${now.toLocaleTimeString()}`;
}

startButton.addEventListener("click", startGame);
resetButton.addEventListener("click", renderMaze);

const availabilityTimer = setInterval(updateAvailabilityCountdown, 1000);
setInterval(updateTime, 1000);