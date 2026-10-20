
console.log("LUDO-MANIA iniciado");

// ==================================================
// PANTALLAS
// ==================================================

const warningScreen = document.getElementById("warning-screen");
const startScreen = document.getElementById("start-screen");
const characterScreen = document.getElementById("character-screen");
const nameScreen = document.getElementById("name-screen");
const gameScreen = document.getElementById("game-screen");
const endScreen = document.getElementById("end-screen");
const rankingScreen = document.getElementById("ranking-screen");

// ==================================================
// BOTONES
// ==================================================

const warningButton = document.getElementById("warning-button");
const startButton = document.getElementById("start-button");
const nameButton = document.getElementById("name-button");
const rankingButton = document.getElementById("ranking-button");
const spinButton = document.getElementById("spin-button");

// ==================================================
// ELEMENTOS DE PERSONAJE
// ==================================================

const characterImage = document.getElementById("character-image");
const characterName = document.getElementById("character-name");
const characterOptions = document.querySelectorAll(".character-option");
const gameCharacterImage = document.getElementById("game-character-image");
const nameCharacterImage = document.getElementById("name-character-image");

// ==================================================
// ELEMENTOS DEL JUEGO
// ==================================================

const chips = document.querySelectorAll(".chip");
const gameMessage = document.getElementById("game-message");
const scoreValue = document.getElementById("score-value");
const reels = document.querySelectorAll(".reel");
const reelsContainer = document.getElementById("reels");

let gameMessageTimeout = null;
let gameMessageVersion = 0;

if (gameMessage && reelsContainer) {
    reelsContainer.appendChild(gameMessage);
}

// ==================================================
// ELEMENTOS DEL NOMBRE Y DEL SCORE
// ==================================================

const playerNameInput = document.getElementById("player-name");
const finalScore = document.getElementById("final-score");
const finalCharacter = document.getElementById("final-character");

// ==================================================
// ELEMENTOS DEL RANKING
// ==================================================

const rankingList = document.getElementById("ranking-list");

// ==================================================
// SÍMBOLOS DE LOS RODILLOS
// ==================================================

const symbols = [
    { name: "trébol", image: "assets/images/trebol.png" },
    { name: "siete", image: "assets/images/siete.png" },
    { name: "pluma", image: "assets/images/pluma.png" },
    { name: "naranja", image: "assets/images/naranja.png" },
    { name: "limón", image: "assets/images/limon.png" },
    { name: "manzana", image: "assets/images/manzana.png" },
    { name: "cereza", image: "assets/images/cereza.png" },
    { name: "diamante", image: "assets/images/diamante.png" }
];

// ==================================================
// PERSONAJES
// ==================================================

const characters = [
    {
        id: 1,
        name: "Jeo",
        selection: "assets/images/personaje1.png",
        profile: "assets/images/logo1.png",
        normal: "assets/images/personaje1_normal.png",
        victory: "assets/images/personaje1_victoria.png",
        bad: "assets/images/personaje1_mala.png"
    },
    {
        id: 2,
        name: "Juana",
        selection: "assets/images/personaje2.png",
        profile: "assets/images/logo2.png",
        normal: "assets/images/personaje2_normal.png",
        victory: "assets/images/personaje2_victoria.png",
        bad: "assets/images/personaje2_mala.png"
    },
    {
        id: 3,
        name: "Jazmin",
        selection: "assets/images/personaje3.png",
        profile: "assets/images/logo3.png",
        normal: "assets/images/personaje3_normal.png",
        victory: "assets/images/personaje3_victoria.png",
        bad: "assets/images/personaje3_mala.png"
    },
    {
        id: 4,
        name: "Joaquin",
        selection: "assets/images/personaje4.png",
        profile: "assets/images/logo4.png",
        normal: "assets/images/personaje4_normal.png",
        victory: "assets/images/personaje4_victoria.png",
        bad: "assets/images/personaje4_mala.png"
    }
];

// ==================================================
// VARIABLES DE LA PARTIDA
// ==================================================

let currentCharacter = 0;
let selectedCharacter = null;
let carouselInterval = null;
let playerName = "";
let playerId = null;
let registrandoJugador = false;
let remainingChips = 3;
let score = 0;
let extraTurns = 0;
let spinning = false;
let reelIntervals = [];

// ==================================================
// RANKING LOCAL
// ==================================================

let ranking = [];

try {
    ranking = JSON.parse(localStorage.getItem("ranking")) || [];
} catch (error) {
    console.error("No se pudo cargar el ranking:", error);
    ranking = [];
}

// ==================================================
// MOSTRAR PERSONAJE EN SELECCIÓN
// ==================================================

function showCharacter(index) {
    characterImage.src = characters[index].selection;
    characterName.textContent = characters[index].name;

    characterOptions.forEach((option, i) => {
        option.classList.toggle("active", i === index);
    });
}

// ==================================================
// ACTUALIZAR FICHAS
// ==================================================

function updateChips() {
    chips.forEach((chip, index) => {
        chip.style.visibility = index < remainingChips
            ? "visible"
            : "hidden";
    });
}

// ==================================================
// ACTUALIZAR PUNTAJE
// ==================================================

function updateScore() {
    if (scoreValue) {
        scoreValue.textContent = score;
    }
}

// ==================================================
// CAMBIAR EXPRESIÓN DEL PERSONAJE
// ==================================================

function setCharacterExpression(expression) {
    if (!selectedCharacter) return;

    if (expression === "normal") {
        gameCharacterImage.src = selectedCharacter.normal;
    }

    if (expression === "victoria") {
        gameCharacterImage.src = selectedCharacter.victory;
    }

    if (expression === "mala") {
        gameCharacterImage.src = selectedCharacter.bad;
    }
}

// ==================================================
// SÍMBOLOS ALEATORIOS
// ==================================================

function getRandomSymbol() {
    return symbols[Math.floor(Math.random() * symbols.length)];
}

function showSymbol(reel, symbol) {
    const reelSymbols = reel.querySelectorAll(".reel-symbol");
    if (reelSymbols.length === 0) return;

    const centerSymbol = reelSymbols[1];
    const image = centerSymbol.querySelector("img");

    if (!image) return;

    image.src = symbol.image;
    image.alt = symbol.name;
}

// ==================================================
// ANIMACIÓN DE GIRO
// ==================================================

function startReelSpin(reel, index) {
    if (reelIntervals[index]) {
        clearInterval(reelIntervals[index]);
    }

    reelIntervals[index] = setInterval(() => {
        const reelSymbols = reel.querySelectorAll(".reel-symbol");

        reelSymbols.forEach(cell => {
            const image = cell.querySelector("img");
            if (!image) return;

            const randomSymbol = getRandomSymbol();
            image.src = randomSymbol.image;
            image.alt = randomSymbol.name;
        });
    }, 90);
}

// ==================================================
// DETENER RODILLOS
// ==================================================

function stopReelSpin(index) {
    const reel = reels[index];
    if (!reel) return;

    if (reelIntervals[index]) {
        clearInterval(reelIntervals[index]);
        reelIntervals[index] = null;
    }

    reel.classList.remove("spinning");
    reel.classList.remove("stopped");

    void reel.offsetWidth;

    reel.classList.add("stopped");
}

function stopAllReels() {
    reels.forEach((reel, index) => {
        stopReelSpin(index);
    });
}

function showRandomReels() {
    reels.forEach((reel, index) => {
        reel.classList.remove("stopped");
        reel.classList.add("spinning");
        startReelSpin(reel, index);
    });
}

// ==================================================
// GUARDAR PARTIDA EN EL RANKING
// ==================================================

function saveRankingEntry() {
    if (!playerName || !playerId || !selectedCharacter) return;

    const entry = {
        player_id: playerId,
        name: playerName,
        character: selectedCharacter.name,
        score: score
    };

    ranking.push(entry);
    ranking.sort((a, b) => b.score - a.score);

    fetch("/api/guardar_partida", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(entry)
    })
        .then(response => response.json())
        .then(data => console.log("Partida guardada en BD:", data))
        .catch(error => console.error("Error conectando con la BD:", error));
}

// ==================================================
// MOSTRAR RANKING
// ==================================================

function renderRanking() {
    if (!rankingList) return;

    rankingList.innerHTML =
        "<p>Cargando ranking oficial desde la base de datos...</p>";

    fetch("/api/ranking")
        .then(response => response.json())
        .then(data => {
            ranking = data;
            dibujarTablaRanking();
        })
        .catch(error => {
            console.error("Error obteniendo ranking:", error);
            rankingList.innerHTML =
                "<p>⚠️ No se pudo conectar a la Base de Datos. Abre el juego con JUGAR.bat (no abras el HTML a mano).</p>";
        });
}

function dibujarTablaRanking() {
    if (!rankingList) return;

    if (ranking.length === 0) {
        rankingList.innerHTML =
            "<p>Todavía no hay partidas registradas.</p>";
        return;
    }

    const topRanking = ranking;
    const table = document.createElement("table");
    table.id = "ranking-table";

    const thead = document.createElement("thead");
    const headerRow = document.createElement("tr");

    ["#", "NOMBRE", "PERSONAJE", "PUNTOS"].forEach(text => {
        const th = document.createElement("th");
        th.textContent = text;
        headerRow.appendChild(th);
    });

    thead.appendChild(headerRow);
    table.appendChild(thead);

    const tbody = document.createElement("tbody");

    topRanking.forEach((entry, index) => {
        const row = document.createElement("tr");

        [
            index + 1,
            entry.name,
            entry.character,
            entry.score
        ].forEach(value => {
            const td = document.createElement("td");
            td.textContent = value;
            row.appendChild(td);
        });

        tbody.appendChild(row);
    });

    table.appendChild(tbody);
    rankingList.replaceChildren(table);
}

// ==================================================
// MOSTRAR RANKING DESDE OTRA PANTALLA
// ==================================================

function showRankingScreen(fromScreen = null) {
    if (fromScreen) {
        fromScreen.classList.add("hidden");
    }

    rankingScreen.classList.remove("hidden");
    renderRanking();
}

// ADVERTENCIA → RANKING
warningButton.addEventListener("click", () => {
    showRankingScreen(warningScreen);
});

// ==================================================
// INICIO → SELECCIÓN
// ==================================================

startButton.addEventListener("click", () => {
    startScreen.classList.add("hidden");
    characterScreen.classList.remove("hidden");

    currentCharacter = 0;
    showCharacter(currentCharacter);

    clearInterval(carouselInterval);

    carouselInterval = setInterval(() => {
        currentCharacter++;

        if (currentCharacter >= characters.length) {
            currentCharacter = 0;
        }

        showCharacter(currentCharacter);
    }, 2000);
});

// ==================================================
// SELECCIONAR PERSONAJE
// ==================================================

function selectCharacter() {
    clearInterval(carouselInterval);
    carouselInterval = null;

    selectedCharacter = characters[currentCharacter];

    console.log("Personaje seleccionado:", selectedCharacter.name);

    if (nameCharacterImage) {
        nameCharacterImage.src = selectedCharacter.profile;
    }

    characterScreen.classList.add("hidden");
    nameScreen.classList.remove("hidden");

    playerNameInput.value = "";

    setTimeout(() => {
        playerNameInput.focus();
    }, 100);
}

// ==================================================
// CONFIRMAR NOMBRE
// ==================================================

function confirmPlayerName() {
    if (registrandoJugador) return;

    let name = playerNameInput.value.trim().toUpperCase();

    if (name.length === 0) {
        playerNameInput.focus();
        return;
    }

    name = name.substring(0, 3);

    registrandoJugador = true;

    if (nameButton) {
        nameButton.disabled = true;
    }

    fetch("/api/registrar_jugador", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ name: name })
    })
        .then(response => response.json())
        .then(data => {
            if (!data || data.status === "error") {
                throw new Error(
                    data && data.message
                        ? data.message
                        : "No se pudo registrar"
                );
            }

            playerId = data.id_jugador;
            playerName = data.nombre;

            console.log("Nombre del jugador:", playerName);

            comenzarPartida();
        })
        .catch(error => {
            console.error("Error registrando jugador:", error);

            alert(
                "No se pudo registrar el jugador. Dejá el servidor encendido con JUGAR.bat."
            );

            playerNameInput.focus();
        })
        .finally(() => {
            registrandoJugador = false;

            if (nameButton) {
                nameButton.disabled = false;
            }
        });
}

// ==================================================
// COMENZAR PARTIDA
// ==================================================

function comenzarPartida() {
    setCharacterExpression("normal");
    stopAllReels();

    reels.forEach((reel, index) => {
        reel.classList.remove("spinning");
        reel.classList.remove("stopped");

        const reelSymbol = reel.querySelector(".reel-symbol");

        if (reelSymbol) {
            reelSymbol.classList.remove("spinning-symbol");
        }

        showSymbol(reel, symbols[index % symbols.length]);
    });

    remainingChips = 3;
    score = 0;
    extraTurns = 0;
    spinning = false;

    updateChips();
    updateScore();

    if (spinButton) {
        spinButton.disabled = false;
    }

    nameScreen.classList.add("hidden");
    gameScreen.classList.remove("hidden");

    clearGameMessage();
    showGameMessage("PRESIONÁ ENTER PARA JUGAR", 1000000);
}

// ==================================================
// MENSAJES DEL JUEGO
// ==================================================

function showGameMessage(message, duration = 5000) {
    if (!gameMessage) return;

    clearTimeout(gameMessageTimeout);
    gameMessageVersion++;

    const currentVersion = gameMessageVersion;

    gameMessage.textContent = message;
    gameMessage.classList.remove("game-message-hidden");
    gameMessage.classList.add("game-message-visible");

    gameMessageTimeout = setTimeout(() => {
        if (currentVersion !== gameMessageVersion) return;

        gameMessage.classList.remove("game-message-visible");
        gameMessage.classList.add("game-message-hidden");
        gameMessage.textContent = "";
    }, duration);
}

function clearGameMessage() {
    clearTimeout(gameMessageTimeout);
    gameMessageVersion++;

    if (!gameMessage) return;

    gameMessage.classList.remove("game-message-visible");
    gameMessage.classList.add("game-message-hidden");
    gameMessage.textContent = "";
}

// ==================================================
// PUNTAJE Y TURNOS EXTRA
// ==================================================

function addScore(points) {
    score = Math.min(score + points, 999);
    updateScore();
}

function addExtraTurns(amount) {
    remainingChips += amount;
    extraTurns += amount;
    updateChips();
}

// ==================================================
// RAREZA DE LOS SÍMBOLOS
// ==================================================

function getSymbolRarity(symbolName) {
    if (!symbolName) return null;

    const normalizedName = symbolName
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");

    if (
        normalizedName === "naranja" ||
        normalizedName === "manzana" ||
        normalizedName === "limon" ||
        normalizedName === "cereza"
    ) {
        return "baja";
    }

    if (
        normalizedName === "siete" ||
        normalizedName === "moneda demoniaca"
    ) {
        return "media";
    }

    if (
        normalizedName === "diamante" ||
        normalizedName === "trebol"
    ) {
        return "alta";
    }

    if (normalizedName === "pluma") {
        return "unica";
    }

    return null;
}

// ==================================================
// COMPROBAR COMBINACIONES
// ==================================================

function evaluateCombination(result) {
    if (!result || result.length < 3) {
        console.warn("Resultado incompleto:", result);
        return;
    }

    const first = result[0];
    const second = result[1];
    const third = result[2];

    // Tres símbolos iguales
    if (first === second && second === third) {
        const rarity = getSymbolRarity(first);

        if (rarity === "unica") {
            addScore(500);
            setCharacterExpression("victoria");
            gameMessage.textContent =
                "¡¡¡3 PLUMAS DE ÁNGEL!!! +500 PUNTOS · ¡PREMIO MAYOR!";
            return;
        }

        const normalizedFirst = first
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "");

        if (normalizedFirst === "moneda demoniaca") {
            addScore(350);
            addExtraTurns(1);
            setCharacterExpression("victoria");
            gameMessage.textContent =
                "¡¡¡3 MONEDAS DEMONÍACAS!!! +350 PUNTOS · +1 TURNO EXTRA";
            return;
        }

        if (rarity === "baja") {
            addScore(100);
            setCharacterExpression("victoria");
            gameMessage.textContent =
                "¡¡¡TRIPLE DE RAREZA BAJA!!! +100 PUNTOS";
            return;
        }

        if (rarity === "media") {
            addScore(200);
            setCharacterExpression("victoria");
            gameMessage.textContent =
                "¡¡¡TRIPLE DE RAREZA MEDIA!!! +200 PUNTOS";
            return;
        }

        if (rarity === "alta") {
            addScore(300);
            setCharacterExpression("victoria");
            gameMessage.textContent =
                "¡¡¡TRIPLE DE RAREZA ALTA!!! +300 PUNTOS";
            return;
        }
    }

    // Buscar dos símbolos iguales
    let pairSymbol = null;

    if (first === second) {
        pairSymbol = first;
    } else if (first === third) {
        pairSymbol = first;
    } else if (second === third) {
        pairSymbol = second;
    }

    if (pairSymbol) {
        const rarity = getSymbolRarity(pairSymbol);

        if (rarity === "unica") {
            addScore(400);
            addExtraTurns(2);
            setCharacterExpression("victoria");
            gameMessage.textContent =
                "¡¡¡2 PLUMAS DE ÁNGEL!!! +400 PUNTOS · +2 TURNOS EXTRA";
            return;
        }

        if (rarity === "baja") {
            addScore(50);
            setCharacterExpression("victoria");
            gameMessage.textContent =
                "¡2 DE RAREZA BAJA! +50 PUNTOS";
            return;
        }

        if (rarity === "media") {
            addScore(75);
            setCharacterExpression("victoria");
            gameMessage.textContent =
                "¡2 DE RAREZA MEDIA! +75 PUNTOS";
            return;
        }

        if (rarity === "alta") {
            addScore(100);
            setCharacterExpression("victoria");
            gameMessage.textContent =
                "¡2 DE RAREZA ALTA! +100 PUNTOS";
            return;
        }
    }

    setCharacterExpression("mala");
    gameMessage.textContent = "SIN COMBINACIÓN";
}

function checkCombination(result) {
    evaluateCombination(result);

    if (gameMessage && gameMessage.textContent.trim() !== "") {
        showGameMessage(gameMessage.textContent.trim(), 5000);
    }
}

// ==================================================
// INICIAR RODILLOS
// ==================================================

function startReels() {
    reels.forEach(reel => {
        reel.classList.add("spinning");
    });
}

// ==================================================
// SPIN
// ==================================================

function spin() {
    clearGameMessage();

    if (spinning) return;
    if (remainingChips <= 0) return;

    spinning = true;

    if (spinButton) {
        spinButton.disabled = true;
    }

    remainingChips--;
    updateChips();

    console.log("Fichas restantes:", remainingChips);

    showRandomReels();

    setTimeout(() => stopReelSpin(0), 1500);
    setTimeout(() => stopReelSpin(1), 2000);
    setTimeout(() => stopReelSpin(2), 2500);

    setTimeout(() => {
        const result = [];

        reels.forEach(reel => {
            const reelSymbols = reel.querySelectorAll(".reel-symbol");
            const centerSymbol = reelSymbols[1];

            if (centerSymbol) {
                const image = centerSymbol.querySelector("img");

                if (image) {
                    result.push(image.alt);
                }
            }
        });

        console.log("Resultado:", result);

        checkCombination(result);

        if (remainingChips > 0) {
            spinning = false;

            if (spinButton) {
                spinButton.disabled = false;
            }

            return;
        }

        setTimeout(() => {
            spinning = false;
            endGame();
        }, 1200);
    }, 2600);
}

// ==================================================
// VOLVER AL MENÚ INICIAL MEDIANTE ENTER
// ==================================================

function returnToStart() {
    remainingChips = 3;
    score = 0;
    extraTurns = 0;

    playerName = "";
    playerId = null;
    selectedCharacter = null;
    currentCharacter = 0;

    spinning = false;
    registrandoJugador = false;

    clearInterval(carouselInterval);
    carouselInterval = null;

    stopAllReels();

    if (playerNameInput) {
        playerNameInput.value = "";
    }

    if (spinButton) {
        spinButton.disabled = false;
    }

    if (nameButton) {
        nameButton.disabled = false;
    }

    updateChips();
    updateScore();
    clearGameMessage();

    warningScreen.classList.add("hidden");
    rankingScreen.classList.add("hidden");
    endScreen.classList.add("hidden");
    gameScreen.classList.add("hidden");
    nameScreen.classList.add("hidden");
    characterScreen.classList.add("hidden");

    startScreen.classList.remove("hidden");

    console.log("Regreso al menú inicial.");
}

// ==================================================
// NAVEGACIÓN ÚNICAMENTE CON ENTER
// ==================================================

document.addEventListener("keydown", event => {
    if (event.key !== "Enter" || event.repeat) return;

    // Evitar envíos de formularios o acciones duplicadas.
    event.preventDefault();

    if (!warningScreen.classList.contains("hidden")) {
        warningButton.click();
        return;
    }

    if (!rankingScreen.classList.contains("hidden")) {
        returnToStart();
        return;
    }

    if (!startScreen.classList.contains("hidden")) {
        startButton.click();
        return;
    }

    if (!characterScreen.classList.contains("hidden")) {
        selectCharacter();
        return;
    }

    if (!nameScreen.classList.contains("hidden")) {
        confirmPlayerName();
        return;
    }

    if (!gameScreen.classList.contains("hidden")) {
        spin();
        return;
    }

    if (!endScreen.classList.contains("hidden")) {
        rankingButton.click();
    }
});

// ==================================================
// BOTÓN CONFIRMAR NOMBRE
// ==================================================

if (nameButton) {
    nameButton.addEventListener("click", () => {
        confirmPlayerName();
    });
}

// ==================================================
// BOTÓN SPIN
// ==================================================

if (spinButton) {
    spinButton.addEventListener("click", () => {
        spin();
    });
}

// ==================================================
// FIN DEL JUEGO → SCORE
// ==================================================

function endGame() {
    spinning = false;

    stopAllReels();
    saveRankingEntry();

    if (spinButton) {
        spinButton.disabled = false;
    }

    gameScreen.classList.add("hidden");
    endScreen.classList.remove("hidden");

    if (finalScore) {
        finalScore.textContent = score;
    }

    const finalPlayerName = document.getElementById("final-player-name");

    if (finalPlayerName) {
        finalPlayerName.textContent = "Jugador: " + playerName;
    }

    if (finalCharacter && selectedCharacter) {
        finalCharacter.textContent =
            "Personaje: " + selectedCharacter.name;
    }

    console.log(
        "Partida terminada.",
        "Jugador:",
        playerName,
        "Puntaje:",
        score
    );
}

// ==================================================
// SCORE → RANKING
// ==================================================

if (rankingButton) {
    rankingButton.addEventListener("click", () => {
        endScreen.classList.add("hidden");
        rankingScreen.classList.remove("hidden");

        renderRanking();

        console.log("Ranking mostrado.");
    });
}
