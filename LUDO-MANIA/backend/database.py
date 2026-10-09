import sqlite3
import os

# Construimos la ruta absoluta para asegurarnos de que el archivo ludo_mania.db
# se guarde exactamente en la carpeta "database" de tu proyecto.
BASE_DIR = os.path.dirname(os.path.dirname(__file__))
DB_PATH = os.path.join(BASE_DIR, 'database', 'ludo_mania.db')

def crear_base_datos():
    """
    Crea la base de datos y las 4 tablas principales si no existen.
    Esta es la estructura (el "esqueleto") de tu información.
    """
    # 1. Nos conectamos a la base de datos.
    # Si el archivo ludo_mania.db no existe, SQLite lo crea automáticamente.
    os.makedirs(os.path.dirname(DB_PATH), exist_ok=True)
    conexion = sqlite3.connect(DB_PATH)
    
    # 2. Creamos un cursor.
    # El cursor es la herramienta que nos permite ejecutar comandos SQL en la base de datos.
    cursor = conexion.cursor()

    # ==========================================
    # TABLA 1: JUGADOR
    # ==========================================
    # Guarda la información de las personas que juegan.
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS Jugador (
        id_jugador INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre TEXT NOT NULL CHECK(length(nombre) <= 3), -- Máximo 3 letras (ej: AAA)
        numero INTEGER NOT NULL DEFAULT 1, -- Distingue a dos personas con el mismo nombre
        fecha_registro DATETIME DEFAULT CURRENT_TIMESTAMP
    )
    ''')
    _asegurar_columna_numero(cursor)

    # ==========================================
    # TABLA 2: PERSONAJE
    # ==========================================
    # Guarda los avatares disponibles en el juego.
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS Personaje (
        id_personaje INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre TEXT NOT NULL,       -- ej: "Personaje 1"
        ruta_imagen TEXT NOT NULL   -- ej: "assets/images/logo1.png"
    )
    ''')

    # ==========================================
    # TABLA 3: PARTIDA (Reemplaza a tu Ranking local)
    # ==========================================
    # Guarda el historial de cada vez que alguien termina de jugar.
    # Se relaciona con Jugador y Personaje mediante Claves Foráneas (FOREIGN KEY).
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS Partida (
        id_partida INTEGER PRIMARY KEY AUTOINCREMENT,
        id_jugador INTEGER,
        id_personaje INTEGER,
        puntuacion_final INTEGER DEFAULT 0,
        fecha_partida DATETIME DEFAULT CURRENT_TIMESTAMP,
        
        -- Estas líneas conectan la partida con quién la jugó y con qué personaje
        FOREIGN KEY (id_jugador) REFERENCES Jugador (id_jugador),
        FOREIGN KEY (id_personaje) REFERENCES Personaje (id_personaje)
    )
    ''')

    # ==========================================
    # TABLA 4: SIMBOLO
    # ==========================================
    # Guarda la configuración de los objetos que giran en los rodillos.
    # Elegí esta 4ta tabla por ser sencilla de entender y manejar para el juego.
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS Simbolo (
        id_simbolo INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre TEXT NOT NULL,       -- ej: "cereza"
        ruta_imagen TEXT NOT NULL,  -- ej: "assets/images/cereza.png"
        valor_puntos INTEGER NOT NULL -- ej: 50 (cuántos puntos da este símbolo)
    )
    ''')

    # 3. Guardamos los cambios realizados en la base de datos.
    conexion.commit()
    
    # 4. Cerramos la conexión para liberar memoria.
    conexion.close()
    
    print(f"Exito! Base de datos creada en: {DB_PATH}")


def _asegurar_columna_numero(cursor):
    """
    Si la base ya existía sin el campo numero, lo agrega
    sin borrar las partidas anteriores.
    """
    columnas = [fila[1] for fila in cursor.execute("PRAGMA table_info(Jugador)").fetchall()]
    if "numero" not in columnas:
        cursor.execute("ALTER TABLE Jugador ADD COLUMN numero INTEGER NOT NULL DEFAULT 1")
    cursor.execute(
        "CREATE UNIQUE INDEX IF NOT EXISTS idx_jugador_nombre_numero ON Jugador (nombre, numero)"
    )


def nombre_visible(nombre, numero):
    """AAA se ve como AAA. El segundo AAA se ve como AAA #2."""
    if not numero or numero <= 1:
        return nombre
    return f"{nombre} #{numero}"


def registrar_jugador(nombre_jugador):
    """
    Crea siempre un jugador nuevo.
    Si el nombre ya existe, le asigna el siguiente número.
    """
    nombre_jugador = (nombre_jugador or "").strip().upper()[:3]
    if not nombre_jugador:
        return None

    conexion = sqlite3.connect(DB_PATH)
    cursor = conexion.cursor()

    cursor.execute(
        "SELECT COALESCE(MAX(numero), 0) FROM Jugador WHERE nombre = ?",
        (nombre_jugador,),
    )
    siguiente = cursor.fetchone()[0] + 1

    cursor.execute(
        "INSERT INTO Jugador (nombre, numero) VALUES (?, ?)",
        (nombre_jugador, siguiente),
    )
    id_jugador = cursor.lastrowid

    conexion.commit()
    conexion.close()

    return {
        "id_jugador": id_jugador,
        "nombre": nombre_jugador,
        "numero": siguiente,
        "display_name": nombre_visible(nombre_jugador, siguiente),
    }

def inicializar_catalogo():
    """
    Inserta los personajes y símbolos iniciales (el 'menú') 
    solo si las tablas están vacías.
    """
    conexion = sqlite3.connect(DB_PATH)
    cursor = conexion.cursor()
    
    # 1. Insertar Personajes
    # Primero revisamos si ya hay personajes (para no duplicarlos si ejecutas esto 2 veces)
    cursor.execute("SELECT COUNT(*) FROM Personaje")
    if cursor.fetchone()[0] == 0:
        personajes = [
            ("Personaje 1", "assets/images/logo1.png"),
            ("Personaje 2", "assets/images/logo2.png"),
            ("Personaje 3", "assets/images/logo3.png"),
            ("Personaje 4", "assets/images/logo4.png")
        ]
        # executemany inserta todos los elementos de la lista de una sola vez
        cursor.executemany("INSERT INTO Personaje (nombre, ruta_imagen) VALUES (?, ?)", personajes)
        print("- Catálogo de personajes cargado.")

    # 2. Insertar Símbolos
    cursor.execute("SELECT COUNT(*) FROM Simbolo")
    if cursor.fetchone()[0] == 0:
        simbolos = [
            ("trébol", "assets/images/trebol.png", 10),
            ("siete", "assets/images/siete.png", 50),
            ("pluma", "assets/images/pluma.png", 20),
            ("naranja", "assets/images/naranja.png", 5),
            ("limón", "assets/images/limon.png", 5),
            ("manzana", "assets/images/manzana.png", 5),
            ("cereza", "assets/images/cereza.png", 15),
            ("diamante", "assets/images/diamante.png", 100)
        ]
        cursor.executemany("INSERT INTO Simbolo (nombre, ruta_imagen, valor_puntos) VALUES (?, ?, ?)", simbolos)
        print("- Catálogo de símbolos cargado.")

    conexion.commit()
    conexion.close()

def guardar_partida(id_jugador, nombre_personaje, puntos):
    conexion = sqlite3.connect(DB_PATH)
    cursor = conexion.cursor()

    # 1. Comprobar que el jugador exista (ya se registró al poner el nombre)
    cursor.execute("SELECT id_jugador FROM Jugador WHERE id_jugador = ?", (id_jugador,))
    if not cursor.fetchone():
        conexion.close()
        return False

    # 2. Obtener id del personaje
    cursor.execute("SELECT id_personaje FROM Personaje WHERE nombre = ?", (nombre_personaje,))
    res_personaje = cursor.fetchone()
    id_personaje = res_personaje[0] if res_personaje else 1

    # 3. Guardar la partida ligada a ESE jugador, no al nombre suelto
    cursor.execute(
        "INSERT INTO Partida (id_jugador, id_personaje, puntuacion_final) VALUES (?, ?, ?)",
        (id_jugador, id_personaje, puntos),
    )

    conexion.commit()
    conexion.close()
    return True

def obtener_ranking():
    conexion = sqlite3.connect(DB_PATH)
    cursor = conexion.cursor()
    
    # Cruzamos las tablas para obtener los datos legibles
    query = '''
        SELECT J.nombre, J.numero, P.nombre, PA.puntuacion_final
        FROM Partida PA
        JOIN Jugador J ON PA.id_jugador = J.id_jugador
        JOIN Personaje P ON PA.id_personaje = P.id_personaje
        ORDER BY PA.puntuacion_final DESC
        LIMIT 10
    '''
    cursor.execute(query)
    resultados = cursor.fetchall()
    conexion.close()

    # Convertimos los resultados a un formato que el frontend entienda (JSON)
    ranking = []
    for r in resultados:
        ranking.append({
            "name": nombre_visible(r[0], r[1]),
            "character": r[2],
            "score": r[3]
        })
    return ranking

# Esta condición verifica si estamos ejecutando este archivo directamente.
# Si es así, llama a las funciones para preparar todo.
if __name__ == '__main__':
    crear_base_datos()
    inicializar_catalogo()
    print("¡Base de datos y catálogos listos para usar!")
