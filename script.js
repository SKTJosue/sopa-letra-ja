const SIZE = 14;

// 10 palabras hardcodeadas
const WORDS = [
    "PEDRO",
    "JUAN",
    "MARIA",
    "JORDAN",
    "FARAON",
    "MOISES",
    "ISRAEL",
    "TEMPLO",
    "ANGEL",
    "DAVID"
];

// Colores únicos para cada palabra encontrada en el tablero
const COLORS = [
    "#f87171", "#fb923c", "#facc15", "#4ade80", 
    "#38bdf8", "#818cf8", "#c084fc", "#f472b6", 
    "#2dd4bf", "#acc12f"
];

let gridData = [];
let wordLocations = {}; // Guardará las coordenadas de cada palabra oculta
let foundWords = [];

const gridElement = document.getElementById("grid");
const wordListElement = document.getElementById("word-list");
const wordInput = document.getElementById("word-input");
const searchBtn = document.getElementById("search-btn");
const messageElement = document.getElementById("message");
const counterElement = document.getElementById("counter");
const restartBtn = document.getElementById("restart-btn");

function initGame() {
    foundWords = [];
    wordLocations = {};
    messageElement.textContent = "";
    messageElement.className = "message";
    wordInput.value = "";
    gridData = Array(SIZE).fill(null).map(() => Array(SIZE).fill(""));
    
    placeWords();
    fillEmptySpaces();
    renderGrid();
    renderWordList();
}

// Colocar las 10 palabras aleatoriamente (Horizontal, Vertical, Diagonales)
function placeWords() {
    const directions = [
        { r: 0, c: 1 },   // Horizontal derecha
        { r: 1, c: 0 },   // Vertical abajo
        { r: 1, c: 1 },   // Diagonal abajo-derecha
        { r: -1, c: 1 }   // Diagonal arriba-derecha
    ];

    WORDS.forEach(word => {
        let placed = false;
        let attempts = 0;

        while (!placed && attempts < 200) {
            attempts++;
            const dir = directions[Math.floor(Math.random() * directions.length)];
            const row = Math.floor(Math.random() * SIZE);
            const col = Math.floor(Math.random() * SIZE);

            if (canPlaceWord(word, row, col, dir)) {
                let coords = [];
                for (let i = 0; i < word.length; i++) {
                    const r = row + i * dir.r;
                    const c = col + i * dir.c;
                    gridData[r][c] = word[i];
                    coords.push({ r, c });
                }
                wordLocations[word] = coords;
                placed = true;
            }
        }
    });
}

function canPlaceWord(word, row, col, dir) {
    const endRow = row + (word.length - 1) * dir.r;
    const endCol = col + (word.length - 1) * dir.c;

    if (endRow < 0 || endRow >= SIZE || endCol < 0 || endCol >= SIZE) return false;

    for (let i = 0; i < word.length; i++) {
        const currR = row + i * dir.r;
        const currC = col + i * dir.c;
        const existingLetter = gridData[currR][currC];
        if (existingLetter !== "" && existingLetter !== word[i]) {
            return false;
        }
    }
    return true;
}

// Rellenar espacios vacíos con letras aleatorias
function fillEmptySpaces() {
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    for (let r = 0; r < SIZE; r++) {
        for (let c = 0; c < SIZE; c++) {
            if (gridData[r][c] === "") {
                gridData[r][c] = alphabet[Math.floor(Math.random() * alphabet.length)];
            }
        }
    }
}

// Renderizar la sopa de letras visualmente
function renderGrid() {
    gridElement.innerHTML = "";
    for (let r = 0; r < SIZE; r++) {
        for (let c = 0; c < SIZE; c++) {
            const cell = document.createElement("div");
            cell.classList.add("cell");
            cell.dataset.row = r;
            cell.dataset.col = c;
            cell.textContent = gridData[r][c];
            gridElement.appendChild(cell);
        }
    }
}

// Renderizar lista lateral de palabras
function renderWordList() {
    wordListElement.innerHTML = "";
    foundWords.forEach(word => {
        const li = document.createElement("li");
        if (foundWords.includes(word)) {
            li.textContent = word;
            li.classList.add("found");
            li.innerHTML += ` ✓`;
        }
        wordListElement.appendChild(li);
    });
    counterElement.textContent = foundWords.length;
}

// Lógica de búsqueda de palabras por input
function handleSearch() {
    const inputVal = wordInput.value.trim().toUpperCase();
    if (!inputVal) return;

    // Verificar si es una de las palabras del juego
    if (WORDS.includes(inputVal)) {
        if (foundWords.includes(inputVal)) {
            messageElement.textContent = `⚠️ Ya encontraste la palabra "${inputVal}"`;
            messageElement.className = "message error";
        } else {
            foundWords.push(inputVal);
            
            // Marcar en la sopa de letras con un color único
            const color = COLORS[(foundWORDS_index = foundWords.length - 1) % COLORS.length];
            const coords = wordLocations[inputVal];
            
            coords.forEach(pos => {
                const cellEl = document.querySelector(`[data-row='${pos.r}'][data-col='${pos.c}']`);
                if (cellEl) {
                    cellEl.style.backgroundColor = color;
                    cellEl.style.color = "#ffffff";
                }
            });

            renderWordList();
            wordInput.value = "";

            if (foundWords.length === WORDS.length) {
                messageElement.textContent = "🎉 ¡Felicidades, encontraste todas las palabras!";
                messageElement.className = "message success";
            } else {
                messageElement.textContent = `✨ ¡Bien! Encontraste "${inputVal}"`;
                messageElement.className = "message success";
            }
        }
    } else {
        messageElement.textContent = `❌ "${inputVal}" no es correcta o no está en la lista. ¡Inténtalo de nuevo!`;
        messageElement.className = "message error";
    }
}

// Eventos
searchBtn.addEventListener("click", handleSearch);
wordInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        handleSearch();
    }
});

restartBtn.addEventListener("click", initGame);

// Inicializar al cargar
initGame();