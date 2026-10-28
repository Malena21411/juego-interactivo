console.log("LUDO-MANIA iniciado");

// ==================================================
// PANTALLAS
// ==================================================

const warningScreen = document.getElementById("warning-screen");
const startScreen = document.getElementById("start-screen");
const characterScreen = document.getElementById("character-screen");
const nameScreen = document.getElementById("name-screen");
const prizesScreen = document.getElementById("prizes-screen");
const gameScreen = document.getElementById("game-screen");
const endScreen = document.getElementById("end-screen");
const rankingScreen = document.getElementById("ranking-screen");

// ==================================================
// BOTONES
// ==================================================

const warningButton = document.getElementById("warning-button");
const startButton = document.getElementById("start-button");
const nameButton = document.getElementById("name-button");
const prizesButton = document.getElementById("prizes-button");
const rankingButton = document.getElementById("ranking-button");
const spinButton = document.getElementById("spin-button");

// ==================================================
// ELEMENTOS DE PERSONAJE
// ==================================================

const characterImage = document.getElementById("character-image");
const characterName = document.getElementById("character-name");
const characterDescription = document.getElementById("character-description");
const characterOptions = document.querySelectorAll(".character-option");
const gameCharacterImage = document.getElementById("game-character-image");
const nameCharacterImage = document.getElementById("name-character-image");

// ==================================================
// ELEMENTOS DEL JUEGO
// ==================================================

const chips = document.querySelectorAll(".chip");
const gameMessage = document.getElementById("game-message");
const scoreValue = document.getElementById("score-value");
const creditsValue = document.getElementById("credits-value");
const reels = document.querySelectorAll(".reel");
const reelsContainer = document.getElementById("reels");
const reelLights = document.querySelectorAll(".reel-light");

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
const finalCredits = document.getElementById("final-credits");

// ==================================================
// ELEMENTOS DEL RANKING
// ==================================================

const rankingList = document.getElementById("ranking-list");

// ==================================================
// ELEMENTOS DE LA PANTALLA DE PREMIOS
// ==================================================

const prizesInfo = document.getElementById("prizes-info");
const prizesList = document.getElementById("prizes-list");

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
        description: "Adicto a la emoción de apostar, terminó jugando contra los demonios para saldar sus deudas. Ahora, su alma está en manos de Mammon, Señor de la Codicia.",
        selection: "assets/images/personaje1.png",
        profile: "assets/images/logo1.png",
        normal: "assets/images/personaje1_normal.png",
        victory: "assets/images/personaje1_victoria.png",
        bad: "assets/images/personaje1_mala.png"
    },
    {
        id: 2,
        name: "Juana",
        description: "Fanática del ocultismo, fue capturada por seguidores de Mammon para ser sacrificada. Ahora, deberá ganar un juego para salvarse y cambiar su destino.",
        selection: "assets/images/personaje2.png",
        profile: "assets/images/logo2.png",
        normal: "assets/images/personaje2_normal.png",
        victory: "assets/images/personaje2_victoria.png",
        bad: "assets/images/personaje2_mala.png"
    },
    {
        id: 3,
        name: "Jazmin",
        description: "Haría cualquier cosa por proteger a su preciado El Cinco, obtenido mediante un tributo incompleto a Mammon. Para saldar su deuda, apostará su propia vida.",
        selection: "assets/images/personaje3.png",
        profile: "assets/images/logo3.png",
        normal: "assets/images/personaje3_normal.png",
        victory: "assets/images/personaje3_victoria.png",
        bad: "assets/images/personaje3_mala.png"
    },
    {
        id: 4,
        name: "Joaquin",
        description: "Apostó su vida 56 veces y siempre logró sobrevivir. Ahora, Mammon quiere arrebatarle su suerte, un don divino que podría desencadenar el apocalipsis.",
        selection: "assets/images/personaje4.png",
        profile: "assets/images/logo4.png",
        normal: "assets/images/personaje4_normal.png",
        victory: "assets/images/personaje4_victoria.png",
        bad: "assets/images/personaje4_mala.png"
    }
];

// ==================================================
// CRÉDITOS
// ==================================================

const INITIAL_CREDITS = 7500;
const SPIN_COST = 2500;

// ==================================================
// PREMIOS (puntos + créditos)
// Las claves van sin tildes y en minúscula.
// ==================================================

const TRIPLE_PRIZES = {
    siete:    { points: 500, credits: 10000 },
    diamante: { points: 300, credits: 5000 },
    trebol:   { points: 200, credits: 3000 }
};

// Tres iguales de cualquier otro símbolo
const DEFAULT_TRIPLE_PRIZE = { points: 150, credits: 2000 };

// Dos iguales, sin importar el símbolo
const PAIR_PRIZE = { points: 50, credits: 500 };


// ==================================================
// ALERTAS DE COMBINACIÓN
// ==================================================

const WIN_ALERT_TITLES = {
    big: "BIG WIN",
    super: "SUPER WIN",
    mega: "MEGA WIN"
};

// Cuánto dura el cartel en pantalla (en milisegundos)
const WIN_ALERT_DURATION = 3000;

// ==================================================
// PROBABILIDADES
// ==================================================

const TRIPLE_CHANCE = 0.12; // 12%: tres iguales
const PAIR_CHANCE = 0.33;   // 33%: exactamente dos iguales
                            // el resto (55%): todos distintos

// Qué tan probable es cada símbolo dentro de un triple
// (más alto = sale más seguido). Los no listados valen 14.
const TRIPLE_WEIGHTS = { siete: 8, diamante: 10, trebol: 12 };
const DEFAULT_TRIPLE_WEIGHT = 14;

// ==================================================
// VARIABLES DE LA PARTIDA
// ==================================================

let currentCharacter = 0;
let selectedCharacter = null;
let carouselInterval = null;
let playerName = "";
let playerId = null;
let registrandoJugador = false;
let credits = INITIAL_CREDITS;
let score = 0;
let spinsPlayed = 0;
let spinHistory = [];
let spinning = false;
let reelIntervals = [];
let expressionTimeout = null;

// Segundos que dura la reacción (winner / loser) antes de volver a normal
const REACTION_DURATION = 3000;

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
    const character = characters[index];

    if (!character) {
        return;
    }

    characterImage.src = character.selection;
    characterImage.alt = character.name;
    characterName.textContent = character.name;

    if (characterDescription) {
        characterDescription.textContent = character.description;
    }

    characterOptions.forEach((option, i) => {
        option.classList.toggle("active", i === index);
    });
}

// ==================================================
// ACTUALIZAR FICHAS
// Cada ficha representa una tirada disponible
// (se muestran hasta 3).
// ==================================================

function updateChips() {
    const availableSpins = Math.floor(credits / SPIN_COST);

    chips.forEach((chip, index) => {
        chip.style.visibility = index < availableSpins
            ? "visible"
            : "hidden";
    });
}

// ==================================================
// CRÉDITOS
// ==================================================

function formatCredits(amount) {
    return String(amount).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

function updateCredits() {
    if (!creditsValue) return;

    creditsValue.textContent = formatCredits(credits);
    creditsValue.classList.toggle("low", credits < SPIN_COST);
}

function addCredits(amount) {
    credits += amount;
    updateCredits();
    updateChips();
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

    // Cancelar cualquier reacción anterior pendiente
    clearTimeout(expressionTimeout);
    expressionTimeout = null;

    if (expression === "normal") {
        gameCharacterImage.src = selectedCharacter.normal;
        return;
    }

    if (expression === "victoria") {
        gameCharacterImage.src = selectedCharacter.victory;
    }

    if (expression === "mala") {
        gameCharacterImage.src = selectedCharacter.bad;
    }

    // La reacción dura unos segundos y después vuelve a la normal
    expressionTimeout = setTimeout(() => {
        setCharacterExpression("normal");
    }, REACTION_DURATION);
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
// LUCES BAJO LOS RODILLOS
// ==================================================

function setReelLight(index, on) {
    const light = reelLights[index];

    if (light) {
        light.classList.toggle("on", on);
    }
}

function resetReelLights() {
    reelLights.forEach(light => light.classList.remove("on"));
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

function stopReelSpin(index, finalSymbol = null) {
    const reel = reels[index];
    if (!reel) return;

    if (reelIntervals[index]) {
        clearInterval(reelIntervals[index]);
        reelIntervals[index] = null;
    }

    // Símbolo decidido para la línea central
    if (finalSymbol) {
        showSymbol(reel, finalSymbol);
        setReelLight(index, true); // se enciende la luz de este rodillo
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
    resetReelLights();

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
        score: score,
        credits_initial: INITIAL_CREDITS,
        credits_final: credits,
        spins: spinsPlayed,
        spin_results: spinHistory
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

    const topRanking = ranking.slice(0, 8);
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

// ==================================================
// PANTALLA DE PREMIOS (antes de jugar)
// Los valores salen de las mismas constantes que usa el juego,
// así que si cambiás un premio se actualiza solo.
// ==================================================

function symbolImageTag(key) {
    const symbol = symbols.find(s => normalizeSymbolName(s.name) === key);

    return symbol
        ? '<img src="' + symbol.image + '" alt="' + symbol.name + '">'
        : "";
}

function renderPrizesScreen() {
    if (prizesInfo) {
        prizesInfo.textContent =
            "EMPEZÁS CON " + formatCredits(INITIAL_CREDITS) +
            " CRÉDITOS · CADA TIRADA CUESTA " + formatCredits(SPIN_COST);
    }

    if (!prizesList) return;

    const triple = key => symbolImageTag(key).repeat(3);

    const rows = [
        { label: triple("siete"), prize: TRIPLE_PRIZES.siete },
        { label: triple("diamante"), prize: TRIPLE_PRIZES.diamante },
        { label: triple("trebol"), prize: TRIPLE_PRIZES.trebol },
        {
            label: "TRES IGUALES<small>OTROS SÍMBOLOS</small>",
            prize: DEFAULT_TRIPLE_PRIZE
        },
        { label: "DOS IGUALES", prize: PAIR_PRIZE },
        { label: "SIN COINCIDENCIA", prize: { points: 0, credits: 0 } }
    ];

    const body = rows.map(row =>
        "<tr>" +
            '<td class="prize-label">' + row.label + "</td>" +
            "<td>" + row.prize.points + "</td>" +
            "<td>" + formatCredits(row.prize.credits) + "</td>" +
        "</tr>"
    ).join("");

    prizesList.innerHTML =
        '<table id="prizes-table">' +
            "<thead><tr>" +
                "<th>COMBINACIÓN</th><th>PUNTOS</th><th>CRÉDITOS</th>" +
            "</tr></thead>" +
            "<tbody>" + body + "</tbody>" +
        "</table>";
}

function showPrizesScreen() {
    renderPrizesScreen();

    nameScreen.classList.add("hidden");
    prizesScreen.classList.remove("hidden");
}

// ==================================================
// ADVERTENCIA → RANKING
// ==================================================

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

            if (!data.id_jugador || !data.nombre) {
                throw new Error("La respuesta del servidor no incluye los datos del jugador");
            }

            playerId = data.id_jugador;
            playerName = data.nombre;

            console.log("Nombre del jugador:", playerName);

            showPrizesScreen();
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
    resetReelLights();

    reels.forEach((reel, index) => {
        reel.classList.remove("spinning");
        reel.classList.remove("stopped");

        const reelSymbol = reel.querySelector(".reel-symbol");

        if (reelSymbol) {
            reelSymbol.classList.remove("spinning-symbol");
        }

        showSymbol(reel, symbols[index % symbols.length]);
    });

    credits = INITIAL_CREDITS;
    spinsPlayed = 0;
    spinHistory = [];
    score = 0;
    spinning = false;

    updateChips();
    updateScore();
    updateCredits();

    if (spinButton) {
        spinButton.disabled = false;
    }

    prizesScreen.classList.add("hidden");
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
// PUNTAJE
// ==================================================

function addScore(points) {
    score = Math.min(score + points, 999);
    updateScore();
}

// ==================================================
// UTILIDADES DE SÍMBOLOS
// ==================================================

function normalizeSymbolName(name) {
    return name
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
}

function shuffle(list) {
    const copy = [...list];

    for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
    }

    return copy;
}

// ==================================================
// RESULTADO DE CADA TIRADA (con probabilidades)
// ==================================================

function getTripleSymbol() {
    const weights = symbols.map(symbol =>
        TRIPLE_WEIGHTS[normalizeSymbolName(symbol.name)] ?? DEFAULT_TRIPLE_WEIGHT
    );

    const total = weights.reduce((sum, w) => sum + w, 0);
    let roll = Math.random() * total;

    for (let i = 0; i < symbols.length; i++) {
        roll -= weights[i];
        if (roll < 0) return symbols[i];
    }

    return symbols[symbols.length - 1];
}

function pickSpinResult() {
    const roll = Math.random();

    // Tres iguales
    if (roll < TRIPLE_CHANCE) {
        const symbol = getTripleSymbol();
        return [symbol, symbol, symbol];
    }

    // Dos iguales
    if (roll < TRIPLE_CHANCE + PAIR_CHANCE) {
        const pair = getRandomSymbol();
        let other;

        do {
            other = getRandomSymbol();
        } while (other === pair);

        return shuffle([pair, pair, other]);
    }

    // Todos distintos
    return shuffle(symbols).slice(0, 3);
}

// ==================================================
// ALERTAS DE COMBINACIÓN (BIG / SUPER / MEGA WIN)
// Solo los tres iguales activan una alerta.
//   MEGA  → tres sietes
//   SUPER → tres diamantes o tres tréboles
//   BIG   → tres iguales de cualquier otro símbolo
// ==================================================

let winAlertElement = null;
let winAlertTimeout = null;

function getWinTier(result) {
    if (!result || result.length < 3) return null;

    const [first, second, third] = result;

    if (!(first === second && second === third)) return null;

    const key = normalizeSymbolName(first);

    if (key === "siete") return "mega";
    if (key === "diamante" || key === "trebol") return "super";

    return "big";
}

function hideWinAlert() {
    clearTimeout(winAlertTimeout);
    winAlertTimeout = null;

    if (winAlertElement) {
        winAlertElement.remove();
        winAlertElement = null;
    }
}

function showWinAlert(tier, prize) {
    hideWinAlert();

    const alertBox = document.createElement("div");
    alertBox.id = "win-alert";
    alertBox.dataset.tier = tier;
    alertBox.setAttribute("role", "status");
    alertBox.setAttribute("aria-live", "polite");

    const box = document.createElement("div");
    box.id = "win-alert-box";

    const title = document.createElement("div");
    title.id = "win-alert-title";
    title.textContent = WIN_ALERT_TITLES[tier];

    const creditsText = document.createElement("div");
    creditsText.id = "win-alert-credits";
    creditsText.textContent = "+" + formatCredits(prize.credits);

    const label = document.createElement("div");
    label.id = "win-alert-label";
    label.textContent = "CRÉDITOS";

    const points = document.createElement("div");
    points.id = "win-alert-points";
    points.textContent = "+" + prize.points + " PUNTOS";

    box.append(title, creditsText, label, points);

    // Chispas pixel que suben alrededor del cartel (el CSS las anima)
    for (let i = 0; i < 12; i++) {
        box.appendChild(document.createElement("i"));
    }

    alertBox.appendChild(box);
    document.body.appendChild(alertBox);

    winAlertElement = alertBox;

    winAlertTimeout = setTimeout(hideWinAlert, WIN_ALERT_DURATION);
}

// ==================================================
// COMPROBAR COMBINACIONES
// ==================================================

function evaluateCombination(result) {
    if (!result || result.length < 3) {
        console.warn("Resultado incompleto:", result);
        return { points: 0, credits: 0 };
    }

    const [first, second, third] = result;
    let prize = null;
    let message = "";

    if (first === second && second === third) {
        prize = TRIPLE_PRIZES[normalizeSymbolName(first)] ?? DEFAULT_TRIPLE_PRIZE;
        message = "¡¡¡TRIPLE DE " + first.toUpperCase() + "!!!";
    } else if (first === second || first === third || second === third) {
        prize = PAIR_PRIZE;
        message = "¡PAR!";
    }

    if (!prize) {
        setCharacterExpression("mala");
        gameMessage.textContent = "SIN COMBINACIÓN · 0 PUNTOS";
        return { points: 0, credits: 0 };
    }

    addScore(prize.points);
    addCredits(prize.credits);
    setCharacterExpression("victoria");

    gameMessage.textContent =
        message + " +" + prize.points + " PUNTOS · +" +
        formatCredits(prize.credits) + " CRÉDITOS";

    return prize;
}

function checkCombination(result) {
    const prize = evaluateCombination(result);

    if (gameMessage && gameMessage.textContent.trim() !== "") {
        showGameMessage(gameMessage.textContent.trim(), 5000);
    }

    return prize;
}

// ==================================================
// SPIN
// ==================================================

function spin() {
    clearGameMessage();

    if (spinning) return;
    if (credits < SPIN_COST) return;
    hideWinAlert();
    spinning = true;

    if (spinButton) {
        spinButton.disabled = true;
    }

    // Al tirar de nuevo el personaje vuelve a su imagen normal
    setCharacterExpression("normal");

    // Se paga la tirada antes de girar
    credits -= SPIN_COST;
    spinsPlayed++;
    updateCredits();
    updateChips();

    console.log("Créditos restantes:", credits);

    showRandomReels();

    // El resultado se decide al empezar y los rodillos se detienen en él
    const outcome = pickSpinResult();

    setTimeout(() => stopReelSpin(0, outcome[0]), 1500);
    setTimeout(() => stopReelSpin(1, outcome[1]), 2000);
    setTimeout(() => stopReelSpin(2, outcome[2]), 2500);

    setTimeout(() => {
        const result = [];

        reels.forEach(reel => {
            const centerSymbol = reel.querySelectorAll(".reel-symbol")[1];
            const image = centerSymbol && centerSymbol.querySelector("img");

            if (image) {
                result.push(image.alt);
            }
        });

        console.log("Resultado:", result);

        const prize = checkCombination(result);

        const tier = getWinTier(result);

        if (tier) {
        showWinAlert(tier, prize);
        }
        spinHistory.push({
            spin: spinsPlayed,
            symbols: result,
            points: prize.points,
            credits: prize.credits

            
        });

        // Todavía alcanza para otra tirada
        if (credits >= SPIN_COST) {
            spinning = false;

            if (spinButton) {
                spinButton.disabled = false;
            }

            return;
        }

        // Sin créditos: mensaje de fin y pantalla de score
        setTimeout(() => {
            showGameMessage("SIN CRÉDITOS · FIN DE LA PARTIDA", 2000);

            setTimeout(() => {
                spinning = false;
                endGame();
            }, 1800);
        }, 2200);
    }, 2600);
}

// ==================================================
// VOLVER AL MENÚ INICIAL MEDIANTE ENTER
// ==================================================

function returnToStart() {
    clearTimeout(expressionTimeout);
    expressionTimeout = null;

    credits = INITIAL_CREDITS;
    spinsPlayed = 0;
    spinHistory = [];
    score = 0;

    playerName = "";
    playerId = null;
    selectedCharacter = null;
    currentCharacter = 0;

    spinning = false;
    registrandoJugador = false;

    clearInterval(carouselInterval);
    carouselInterval = null;

    stopAllReels();
    resetReelLights();

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
    updateCredits();
    clearGameMessage();

    warningScreen.classList.add("hidden");
    rankingScreen.classList.add("hidden");
    endScreen.classList.add("hidden");
    gameScreen.classList.add("hidden");
    nameScreen.classList.add("hidden");
    prizesScreen.classList.add("hidden");
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

    if (!prizesScreen.classList.contains("hidden")) {
        comenzarPartida();
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
// BOTÓN JUGAR (pantalla de premios)
// ==================================================

if (prizesButton) {
    prizesButton.addEventListener("click", () => {
        comenzarPartida();
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
        spinButton.disabled = true;
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

    if (finalCredits) {
        finalCredits.textContent =
            "Créditos restantes: " + formatCredits(credits);
    }

    console.log(
        "Partida terminada.",
        "Jugador:",
        playerName,
        "Puntaje:",
        score,
        "Créditos:",
        credits
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
