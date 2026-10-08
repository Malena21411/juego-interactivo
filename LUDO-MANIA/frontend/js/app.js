console.log("LUDO-MANIA iniciado");


// ==================================================
// PANTALLAS
// ==================================================

const warningScreen =
    document.getElementById("warning-screen");

const startScreen =
    document.getElementById("start-screen");

const characterScreen =
    document.getElementById("character-screen");

const nameScreen =
    document.getElementById("name-screen");

const gameScreen =
    document.getElementById("game-screen");

const endScreen =
    document.getElementById("end-screen");

const rankingScreen =
    document.getElementById("ranking-screen");


// ==================================================
// BOTONES
// ==================================================

const warningButton =
    document.getElementById("warning-button");

const startButton =
    document.getElementById("start-button");

const nameButton =
    document.getElementById("name-button");

const rankingButton =
    document.getElementById("ranking-button");

const restartButton =
    document.getElementById("restart-button");

const spinButton =
    document.getElementById("spin-button");


// ==================================================
// ELEMENTOS DE PERSONAJE
// ==================================================

const characterImage =
    document.getElementById("character-image");

const characterName =
    document.getElementById("character-name");

const characterOptions =
    document.querySelectorAll(".character-option");

const gameCharacterImage =
    document.getElementById("game-character-image");


// Foto circular del personaje en pantalla de nombre

const nameCharacterImage =
    document.getElementById("name-character-image");


// ==================================================
// ELEMENTOS DEL JUEGO
// ==================================================

const chips =
    document.querySelectorAll(".chip");

const gameMessage =
    document.getElementById("game-message");

const scoreValue =
    document.getElementById("score-value");

const reels =
    document.querySelectorAll(".reel");


// ==================================================
// ELEMENTOS DEL NOMBRE
// ==================================================

const playerNameInput =
    document.getElementById("player-name");


// ==================================================
// ELEMENTOS DEL SCORE
// ==================================================

const finalScore =
    document.getElementById("final-score");

const finalCharacter =
    document.getElementById("final-character");


// ==================================================
// ELEMENTOS DEL RANKING
// ==================================================

const rankingList =
    document.getElementById("ranking-list");


// ==================================================
// SÍMBOLOS DE LOS RODILLOS
// ==================================================

const symbols = [

    {
        name: "trébol",
        image: "assets/images/trebol.png"
    },

    {
        name: "siete",
        image: "assets/images/siete.png"
    },

    {
        name: "pluma",
        image: "assets/images/pluma.png"
    },

    {
        name: "naranja",
        image: "assets/images/naranja.png"
    },

    {
        name: "limón",
        image: "assets/images/limon.png"
    },

    {
        name: "manzana",
        image: "assets/images/manzana.png"
    },

    {
        name: "cereza",
        image: "assets/images/cereza.png"
    },

    {
        name: "diamante",
        image: "assets/images/diamante.png"
    }

];


// ==================================================
// PERSONAJES
// ==================================================

const characters = [

    {
        id: 1,
        name: "Personaje 1",

        selection:
            "assets/images/personaje1.png",

        profile:
            "assets/images/logo1.png",

        normal:
            "assets/images/personaje1_normal.png",

        victory:
            "assets/images/personaje1_victoria.png",

        bad:
            "assets/images/personaje1_mala.png"
    },

    {
        id: 2,
        name: "Personaje 2",

        selection:
            "assets/images/personaje2.png",

        profile:
            "assets/images/logo2.png",

        normal:
            "assets/images/personaje2_normal.png",

        victory:
            "assets/images/personaje2_victoria.png",

        bad:
            "assets/images/personaje2_mala.png"
    },

    {
        id: 3,
        name: "Personaje 3",

        selection:
            "assets/images/personaje3.png",

        profile:
            "assets/images/logo3.png",

        normal:
            "assets/images/personaje3_normal.png",

        victory:
            "assets/images/personaje3_victoria.png",

        bad:
            "assets/images/personaje3_mala.png"
    },

    {
        id: 4,
        name: "Personaje 4",

        selection:
            "assets/images/personaje4.png",

        profile:
            "assets/images/logo4.png",

        normal:
            "assets/images/personaje4_normal.png",

        victory:
            "assets/images/personaje4_victoria.png",

        bad:
            "assets/images/personaje4_mala.png"
    }

];


// ==================================================
// VARIABLES DE LA PARTIDA
// ==================================================

let currentCharacter = 0;

let selectedCharacter = null;

let carouselInterval = null;

let playerName = "";

let remainingChips = 3;

let score = 0;

let extraTurns = 0;

let spinning = false;


// ==================================================
// VARIABLES DE LOS RODILLOS
// ==================================================

// Intervalos individuales para la animación

let reelIntervals = [];


// ==================================================
// RANKING
// ==================================================

// Cargar ranking guardado en el navegador

let ranking = [];

try {

    ranking =
        JSON.parse(
            localStorage.getItem("ranking")
        ) || [];

} catch (error) {

    console.error(
        "No se pudo cargar el ranking:",
        error
    );

    ranking = [];

}


// ==================================================
// MOSTRAR PERSONAJE EN SELECCIÓN
// ==================================================

function showCharacter(index) {

    characterImage.src =
        characters[index].selection;

    characterName.textContent =
        characters[index].name;

    characterOptions.forEach((option, i) => {

        option.classList.remove("active");

        if (i === index) {

            option.classList.add("active");

        }

    });

}


// ==================================================
// ACTUALIZAR FICHAS
// ==================================================

function updateChips() {

    chips.forEach((chip, index) => {

        if (index < remainingChips) {

            chip.style.visibility =
                "visible";

        } else {

            chip.style.visibility =
                "hidden";

        }

    });

}


// ==================================================
// ACTUALIZAR PUNTAJE
// ==================================================

function updateScore() {

    if (!scoreValue) {
        return;
    }

    scoreValue.textContent =
        score;

}


// ==================================================
// CAMBIAR EXPRESIÓN DEL PERSONAJE
// ==================================================

function setCharacterExpression(expression) {

    if (!selectedCharacter) {

        return;

    }


    if (expression === "normal") {

        gameCharacterImage.src =
            selectedCharacter.normal;

    }


    if (expression === "victoria") {

        gameCharacterImage.src =
            selectedCharacter.victory;

    }


    if (expression === "mala") {

        gameCharacterImage.src =
            selectedCharacter.bad;

    }

}


// ==================================================
// OBTENER SÍMBOLO ALEATORIO
// ==================================================

function getRandomSymbol() {

    const index =
        Math.floor(
            Math.random() * symbols.length
        );

    return symbols[index];

}


// ==================================================
// MOSTRAR UN SÍMBOLO EN UN RODILLO
// ==================================================

function showSymbol(reel, symbol) {

    // Usamos la fila central como resultado
    const reelSymbols =
        reel.querySelectorAll(".reel-symbol");

    if (reelSymbols.length === 0) {

        return;

    }


    const centerSymbol =
        reelSymbols[1];

    const image =
        centerSymbol.querySelector("img");

    if (!image) {

        return;

    }


    image.src =
        symbol.image;

    image.alt =
        symbol.name;

}


// ==================================================
// ANIMACIÓN DE GIRO
// ==================================================

function startReelSpin(reel, index) {

    // Evitar intervalos duplicados

    if (reelIntervals[index]) {

        clearInterval(
            reelIntervals[index]
        );

    }


    reelIntervals[index] =
        setInterval(() => {

            const reelSymbols =
                reel.querySelectorAll(
                    ".reel-symbol"
                );


            reelSymbols.forEach(cell => {

                const image =
                    cell.querySelector("img");

                if (!image) {

                    return;

                }


                const randomIndex =
                    Math.floor(
                        Math.random() *
                        symbols.length
                    );


                const randomSymbol =
                    symbols[randomIndex];


                image.src =
                    randomSymbol.image;

                image.alt =
                    randomSymbol.name;

            });

        }, 90);

}


// ==================================================
// DETENER UN RODILLO
// ==================================================

function stopReelSpin(index) {

    const reel =
        reels[index];

    if (!reel) {

        return;

    }


    // Detener intervalo

    if (reelIntervals[index]) {

        clearInterval(
            reelIntervals[index]
        );

        reelIntervals[index] =
            null;

    }


    // Quitar animación

    reel.classList.remove(
        "spinning"
    );


    // Efecto visual de frenado

    reel.classList.remove(
        "stopped"
    );

    void reel.offsetWidth;

    reel.classList.add(
        "stopped"
    );

}


// ==================================================
// DETENER TODOS LOS RODILLOS
// ==================================================

function stopAllReels() {

    reels.forEach((reel, index) => {

        stopReelSpin(index);

    });

}


// ==================================================
// MOSTRAR SÍMBOLOS ALEATORIOS
// ==================================================

function showRandomReels() {

    reels.forEach((reel, index) => {

        reel.classList.remove(
            "stopped"
        );

        reel.classList.add(
            "spinning"
        );


        startReelSpin(
            reel,
            index
        );

    });

}


// ==================================================
// GUARDAR PARTIDA EN EL RANKING
// ==================================================

function saveRankingEntry() {

    if (!playerName ||
        !selectedCharacter) {

        return;

    }


    const entry = {

        name:
            playerName,

        character:
            selectedCharacter.name,

        score:
            score

    };


    // Agregar partida

    ranking.push(entry);


    // Ordenar de mayor a menor

    ranking.sort((a, b) => {

        return b.score - a.score;

    });


    // Guardar en navegador

    try {

        localStorage.setItem(
            "ranking",
            JSON.stringify(ranking)
        );

    } catch (error) {

        console.error(
            "No se pudo guardar el ranking:",
            error
        );

    }


    console.log(
        "Partida guardada:",
        entry
    );

}


// ==================================================
// MOSTRAR RANKING
// ==================================================

function renderRanking() {

    if (!rankingList) {

        console.warn(
            "No existe #ranking-list en el HTML."
        );

        return;

    }


    // No hay partidas

    if (ranking.length === 0) {

        rankingList.innerHTML =
            "<p>Todavía no hay partidas registradas.</p>";

        return;

    }


    // Crear tabla

    const table =
        document.createElement("table");

    table.id =
        "ranking-table";


    // ==================================================
    // CABECERA
    // ==================================================

    const thead =
        document.createElement("thead");

    const headerRow =
        document.createElement("tr");


    const headers = [
        "#",
        "NOMBRE",
        "PERSONAJE",
        "PUNTOS"
    ];


    headers.forEach(headerText => {

        const th =
            document.createElement("th");

        th.textContent =
            headerText;

        headerRow.appendChild(th);

    });


    thead.appendChild(
        headerRow
    );

    table.appendChild(
        thead
    );


    // ==================================================
    // CUERPO
    // ==================================================

    const tbody =
        document.createElement("tbody");


    ranking.forEach((entry, index) => {

        const row =
            document.createElement("tr");


        const positionCell =
            document.createElement("td");

        positionCell.textContent =
            index + 1;


        const nameCell =
            document.createElement("td");

        nameCell.textContent =
            entry.name;


        const characterCell =
            document.createElement("td");

        characterCell.textContent =
            entry.character;


        const scoreCell =
            document.createElement("td");

        scoreCell.textContent =
            entry.score;


        row.appendChild(
            positionCell
        );

        row.appendChild(
            nameCell
        );

        row.appendChild(
            characterCell
        );

        row.appendChild(
            scoreCell
        );


        tbody.appendChild(
            row
        );

    });


    table.appendChild(
        tbody
    );


    // Reemplazar contenido anterior

    rankingList.replaceChildren(
        table
    );

}


// ==================================================
// ADVERTENCIA → INICIO
// ==================================================

warningButton.addEventListener(
    "click",
    () => {

        warningScreen.classList.add(
            "hidden"
        );

        startScreen.classList.remove(
            "hidden"
        );

    }
);


// ==================================================
// INICIO → SELECCIÓN
// ==================================================

startButton.addEventListener(
    "click",
    () => {

        startScreen.classList.add(
            "hidden"
        );

        characterScreen.classList.remove(
            "hidden"
        );


        currentCharacter = 0;

        showCharacter(
            currentCharacter
        );


        clearInterval(
            carouselInterval
        );


        carouselInterval =
            setInterval(() => {

                currentCharacter++;


                if (
                    currentCharacter >=
                    characters.length
                ) {

                    currentCharacter = 0;

                }


                showCharacter(
                    currentCharacter
                );

            }, 2000);

    }
);


// ==================================================
// SELECCIONAR PERSONAJE
// ==================================================

function selectCharacter() {

    clearInterval(
        carouselInterval
    );

    carouselInterval =
        null;


    selectedCharacter =
        characters[currentCharacter];


    console.log(
        "Personaje seleccionado:",
        selectedCharacter.name
    );


    // ==================================================
    // FOTO DE PERFIL
    // ==================================================

    if (nameCharacterImage) {

        nameCharacterImage.src =
            selectedCharacter.profile;

    }


    // ==================================================
    // PASAR A PANTALLA DE NOMBRE
    // ==================================================

    characterScreen.classList.add(
        "hidden"
    );

    nameScreen.classList.remove(
        "hidden"
    );


    playerNameInput.value =
        "";


    setTimeout(() => {

        playerNameInput.focus();

    }, 100);

}


// ==================================================
// CONFIRMAR NOMBRE
// ==================================================

function confirmPlayerName() {

    let name =
        playerNameInput.value
            .trim()
            .toUpperCase();


    // ==================================================
    // COMPROBAR NOMBRE VACÍO
    // ==================================================

    if (name.length === 0) {

        playerNameInput.focus();

        return;

    }


    // ==================================================
    // MÁXIMO 3 CARACTERES
    // ==================================================

    name =
        name.substring(
            0,
            3
        );


    playerName =
        name;


    console.log(
        "Nombre del jugador:",
        playerName
    );


    // ==================================================
    // PREPARAR PERSONAJE
    // ==================================================

    setCharacterExpression(
        "normal"
    );


    // ==================================================
    // DETENER CUALQUIER GIRO ANTERIOR
    // ==================================================

    stopAllReels();


    // ==================================================
    // PREPARAR RODILLOS
    // ==================================================

    reels.forEach(
        (reel, index) => {

            reel.classList.remove(
                "spinning"
            );


            reel.classList.remove(
                "stopped"
            );


            const reelSymbol =
                reel.querySelector(
                    ".reel-symbol"
                );


            if (reelSymbol) {

                reelSymbol.classList.remove(
                    "spinning-symbol"
                );

            }


            // Colocar símbolo inicial

            showSymbol(
                reel,
                symbols[
                    index %
                    symbols.length
                ]
            );

        }
    );


    // ==================================================
    // REINICIAR PARTIDA
    // ==================================================
remainingChips = 3;

score = 0;

extraTurns = 0;

spinning = false;


    updateChips();

    updateScore();


    // ==================================================
    // ACTIVAR BOTÓN
    // ==================================================

    if (spinButton) {

        spinButton.disabled =
            false;

    }


    // ==================================================
    // PASAR A JUEGO
    // ==================================================

    nameScreen.classList.add(
        "hidden"
    );

    gameScreen.classList.remove(
        "hidden"
    );


    gameMessage.textContent =
        "PRESIONÁ ENTER PARA JUGAR";

}


// ==================================================
// COMPROBAR COMBINACIÓN
// ==================================================

// Suma puntos respetando el máximo de 999
function addScore(points) {

    score = Math.min(
        score + points,
        999
    );

    updateScore();

}


// ==================================================
// AGREGAR TURNOS EXTRA
// ==================================================

function addExtraTurns(amount) {

    remainingChips += amount;

    extraTurns += amount;

    updateChips();

}


// ==================================================
// OBTENER RAREZA DEL SÍMBOLO
// ==================================================

function getSymbolRarity(symbolName) {

    if (!symbolName) {

        return null;

    }


    // Normalizar el nombre para evitar
    // problemas con tildes

    const normalizedName =
        symbolName
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "");


    // ==================================================
    // RAREZA BAJA
    // ==================================================

    if (
        normalizedName === "naranja" ||
        normalizedName === "manzana" ||
        normalizedName === "limon" ||
        normalizedName === "cereza"
    ) {

        return "baja";

    }


    // ==================================================
    // RAREZA MEDIA
    // ==================================================

    if (
        normalizedName === "siete" ||
        normalizedName === "moneda demoniaca"
    ) {

        return "media";

    }


    // ==================================================
    // RAREZA ALTA
    // ==================================================

    if (
        normalizedName === "diamante" ||
        normalizedName === "trebol"
    ) {

        return "alta";

    }


    // ==================================================
    // SÍMBOLO ÚNICO
    // ==================================================

    if (
        normalizedName === "pluma"
    ) {

        return "unica";

    }


    return null;

}


// ==================================================
// COMBINACIONES
// ==================================================

function checkCombination(result) {

    // Comprobar que existan tres resultados

    if (
        !result ||
        result.length < 3
    ) {

        console.warn(
            "Resultado incompleto:",
            result
        );

        return;

    }


    const first =
        result[0];

    const second =
        result[1];

    const third =
        result[2];


    // ==================================================
    // TRES SÍMBOLOS IGUALES
    // ==================================================

    if (
        first === second &&
        second === third
    ) {

        const rarity =
            getSymbolRarity(first);


        // ==================================================
        // 3 PLUMAS DE ÁNGEL
        // ==================================================

        if (
            rarity === "unica"
        ) {

            addScore(500);

            setCharacterExpression(
                "victoria"
            );

            gameMessage.textContent =
                "¡¡¡3 PLUMAS DE ÁNGEL!!! +500 PUNTOS · ¡PREMIO MAYOR!";

            return;

        }


        // ==================================================
        // 3 MONEDAS DEMONÍACAS
        // ==================================================

        const normalizedFirst =
            first
                .toLowerCase()
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "");


        if (
            normalizedFirst ===
            "moneda demoniaca"
        ) {

            addScore(350);

            addExtraTurns(1);

            setCharacterExpression(
                "victoria"
            );

            gameMessage.textContent =
                "¡¡¡3 MONEDAS DEMONÍACAS!!! +350 PUNTOS · +1 TURNO EXTRA";

            return;

        }


        // ==================================================
        // 3 DE RAREZA BAJA
        // ==================================================

        if (
            rarity === "baja"
        ) {

            addScore(100);

            setCharacterExpression(
                "victoria"
            );

            gameMessage.textContent =
                "¡¡¡TRIPLE DE RAREZA BAJA!!! +100 PUNTOS";

            return;

        }


        // ==================================================
        // 3 DE RAREZA MEDIA
        // ==================================================

        if (
            rarity === "media"
        ) {

            addScore(200);

            setCharacterExpression(
                "victoria"
            );

            gameMessage.textContent =
                "¡¡¡TRIPLE DE RAREZA MEDIA!!! +200 PUNTOS";

            return;

        }


        // ==================================================
        // 3 DE RAREZA ALTA
        // ==================================================

        if (
            rarity === "alta"
        ) {

            addScore(300);

            setCharacterExpression(
                "victoria"
            );

            gameMessage.textContent =
                "¡¡¡TRIPLE DE RAREZA ALTA!!! +300 PUNTOS";

            return;

        }

    }


    // ==================================================
    // BUSCAR DOS SÍMBOLOS IGUALES
    // ==================================================

    let pairSymbol = null;


    if (
        first === second
    ) {

        pairSymbol =
            first;

    }

    else if (
        first === third
    ) {

        pairSymbol =
            first;

    }

    else if (
        second === third
    ) {

        pairSymbol =
            second;

    }


    // ==================================================
    // EXISTE UNA PAREJA
    // ==================================================

    if (pairSymbol) {

        const rarity =
            getSymbolRarity(
                pairSymbol
            );


        // ==================================================
        // 2 PLUMAS DE ÁNGEL
        // ==================================================

        if (
            rarity === "unica"
        ) {

            addScore(400);

            addExtraTurns(2);

            setCharacterExpression(
                "victoria"
            );

            gameMessage.textContent =
                "¡¡¡2 PLUMAS DE ÁNGEL!!! +400 PUNTOS · +2 TURNOS EXTRA";

            return;

        }


        // ==================================================
        // 2 DE RAREZA BAJA
        // ==================================================

        if (
            rarity === "baja"
        ) {

            addScore(50);

            setCharacterExpression(
                "victoria"
            );

            gameMessage.textContent =
                "¡2 DE RAREZA BAJA! +50 PUNTOS";

            return;

        }


        // ==================================================
        // 2 DE RAREZA MEDIA
        // ==================================================

        if (
            rarity === "media"
        ) {

            addScore(75);

            setCharacterExpression(
                "victoria"
            );

            gameMessage.textContent =
                "¡2 DE RAREZA MEDIA! +75 PUNTOS";

            return;

        }


        // ==================================================
        // 2 DE RAREZA ALTA
        // ==================================================

        if (
            rarity === "alta"
        ) {

            addScore(100);

            setCharacterExpression(
                "victoria"
            );

            gameMessage.textContent =
                "¡2 DE RAREZA ALTA! +100 PUNTOS";

            return;

        }

    }


    // ==================================================
    // SIN COMBINACIÓN
    // ==================================================

    setCharacterExpression(
        "mala"
    );

    gameMessage.textContent =
        "SIN COMBINACIÓN";

}


// ==================================================
// INICIAR ANIMACIÓN DE LOS RODILLOS
// ==================================================

function startReels() {

    reels.forEach(
        (reel) => {

            reel.classList.add(
                "spinning"
            );

        }
    );

}


// ==================================================
// SPIN
// ==================================================

function spin() {

    // ==================================================
    // EVITAR VARIAS TIRADAS SIMULTÁNEAS
    // ==================================================

    if (spinning) {

        return;

    }


    // ==================================================
    // NO JUGAR SI NO QUEDAN FICHAS
    // ==================================================

    if (
        remainingChips <= 0
    ) {

        return;

    }


    // ==================================================
    // BLOQUEAR NUEVA TIRADA
    // ==================================================

    spinning =
        true;


    // ==================================================
    // DESACTIVAR BOTÓN
    // ==================================================

    if (spinButton) {

        spinButton.disabled =
            true;

    }


    // ==================================================
    // CONSUMIR UNA FICHA
    // ==================================================

    remainingChips--;

    updateChips();


    console.log(
        "Fichas restantes:",
        remainingChips
    );


    // ==================================================
    // INICIAR RODILLOS
    // ==================================================

    showRandomReels();


    // ==================================================
    // RODILLO 1
    // ==================================================

    setTimeout(() => {

        stopReelSpin(0);

    }, 1500);


    // ==================================================
    // RODILLO 2
    // ==================================================

    setTimeout(() => {

        stopReelSpin(1);

    }, 2000);


    // ==================================================
    // RODILLO 3
    // ==================================================

    setTimeout(() => {

        stopReelSpin(2);

    }, 2500);


    // ==================================================
    // OBTENER RESULTADO
    // ==================================================

    setTimeout(() => {

        const result = [];


        reels.forEach(
            reel => {

                const reelSymbols =
                    reel.querySelectorAll(
                        ".reel-symbol"
                    );


                // La fila central es el resultado

                const centerSymbol =
                    reelSymbols[1];


                if (
                    centerSymbol
                ) {

                    const image =
                        centerSymbol.querySelector(
                            "img"
                        );


                    if (
                        image
                    ) {

                        result.push(
                            image.alt
                        );

                    }

                }

            }
        );


        console.log(
            "Resultado:",
            result
        );


        // ==================================================
        // COMPROBAR COMBINACIÓN
        // ==================================================

        checkCombination(
            result
        );


        // ==================================================
        // COMPROBAR SI HAY MÁS TURNOS
        // ==================================================

        if (
            remainingChips > 0
        ) {

            // Todavía quedan fichas normales
            // o se obtuvo un turno extra.

            spinning =
                false;


            if (spinButton) {

                spinButton.disabled =
                    false;

            }

            return;

        }


        // ==================================================
        // NO QUEDAN TURNOS
        // ==================================================

        setTimeout(() => {

            spinning =
                false;

            endGame();

        }, 1200);


    }, 2600);

}


// ==================================================
// ENTER
// ==================================================

document.addEventListener(
    "keydown",
    (event) => {


        // ==================================================
        // ENTER EN SELECCIÓN
        // ==================================================

        if (
            event.key === "Enter" &&
            !characterScreen.classList.contains(
                "hidden"
            )
        ) {

            selectCharacter();

            return;

        }


        // ==================================================
        // ENTER EN NOMBRE
        // ==================================================

        if (
            event.key === "Enter" &&
            !nameScreen.classList.contains(
                "hidden"
            )
        ) {

            confirmPlayerName();

            return;

        }


        // ==================================================
        // ENTER EN JUEGO
        // ==================================================

        if (
            event.key === "Enter" &&
            !gameScreen.classList.contains(
                "hidden"
            )
        ) {

            spin();

            return;

        }

    }
);


// ==================================================
// BOTÓN CONFIRMAR NOMBRE
// ==================================================

if (nameButton) {

    nameButton.addEventListener(
        "click",
        () => {

            confirmPlayerName();

        }
    );

}


// ==================================================
// BOTÓN SPIN
// ==================================================

if (spinButton) {

    spinButton.addEventListener(
        "click",
        () => {

            spin();

        }
    );

}


// ==================================================
// FIN DEL JUEGO → SCORE
// ==================================================

function endGame() {

    // ==================================================
    // ASEGURAR QUE NO QUEDE UNA TIRADA ACTIVA
    // ==================================================

    spinning =
        false;


    // ==================================================
    // DETENER CUALQUIER ANIMACIÓN
    // ==================================================

    stopAllReels();


    // ==================================================
    // GUARDAR PARTIDA EN RANKING
    // ==================================================

    saveRankingEntry();


    // ==================================================
    // ACTIVAR BOTÓN
    // ==================================================

    if (spinButton) {

        spinButton.disabled =
            false;

    }


    // ==================================================
    // CAMBIAR DE PANTALLA
    // ==================================================

    gameScreen.classList.add(
        "hidden"
    );

    endScreen.classList.remove(
        "hidden"
    );


    // ==================================================
    // MOSTRAR PUNTAJE
    // ==================================================

    if (finalScore) {

        finalScore.textContent =
            score;

    }


    // ==================================================
    // MOSTRAR PERSONAJE
    // ==================================================

    if (
        finalCharacter &&
        selectedCharacter
    ) {

        finalCharacter.textContent =
            "Personaje: " +
            selectedCharacter.name;

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

    rankingButton.addEventListener(
        "click",
        () => {

            // Actualizar ranking antes de mostrarlo

            renderRanking();


            // Cambiar pantalla

            endScreen.classList.add(
                "hidden"
            );

            rankingScreen.classList.remove(
                "hidden"
            );


            console.log(
                "Ranking mostrado."
            );

        }
    );

}


// ==================================================
// RANKING → INICIO
// ==================================================

if (restartButton) {

    restartButton.addEventListener(
        "click",
        () => {


            // ==============================================
            // REINICIAR DATOS DE LA PARTIDA
            // ==============================================

            remainingChips =
                3;

            score =
                0;

            playerName =
                "";

            selectedCharacter =
                null;

            currentCharacter =
                0;

            spinning =
                false;


            // ==============================================
            // DETENER CARRUSEL
            // ==============================================

            clearInterval(
                carouselInterval
            );

            carouselInterval =
                null;


            // ==============================================
            // DETENER RODILLOS
            // ==============================================

            stopAllReels();


            // ==============================================
            // LIMPIAR CAMPO DE NOMBRE
            // ==============================================

            if (playerNameInput) {

                playerNameInput.value =
                    "";

            }


            // ==============================================
            // ACTUALIZAR INTERFAZ
            // ==============================================

            updateChips();

            updateScore();


            // ==============================================
            // OCULTAR PANTALLAS
            // ==============================================

            rankingScreen.classList.add(
                "hidden"
            );

            endScreen.classList.add(
                "hidden"
            );

            gameScreen.classList.add(
                "hidden"
            );

            nameScreen.classList.add(
                "hidden"
            );

            characterScreen.classList.add(
                "hidden"
            );


            // ==============================================
            // VOLVER AL MENÚ
            // ==============================================

            startScreen.classList.remove(
                "hidden"
            );


            console.log(
                "Nueva partida preparada."
            );

        }
    );

}