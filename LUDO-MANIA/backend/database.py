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
        fecha_registro DATETIME DEFAULT CURRENT_TIMESTAMP
    )
    ''')

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

# Esta condición verifica si estamos ejecutando este archivo directamente.
# Si es así, llama a la función para crear la base de datos.
if __name__ == '__main__':
    crear_base_datos()
