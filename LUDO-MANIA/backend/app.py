# pyrefly: ignore [missing-import]
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import os
import database

FRONTEND_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "frontend")

app = Flask(__name__, static_folder=FRONTEND_DIR, static_url_path="")
# CORS permite que el frontend se comunique con este backend
# si se abre desde otro origen (por ejemplo, un archivo HTML local).
CORS(app)

@app.route("/api/registrar_jugador", methods=["POST"])
def registrar_jugador():
    """
    Crea un jugador al confirmar el nombre.
    Si el nombre ya existe, guarda un número interno para distinguirlo.
    """
    data = request.json or {}
    nombre = data.get("name")
    jugador = database.registrar_jugador(nombre)
    if not jugador:
        return jsonify({"status": "error", "message": "Nombre inválido"}), 400
    return jsonify({"status": "success", **jugador})


@app.route("/api/guardar_partida", methods=["POST"])
def guardar_partida():
    """
    Recibe los datos del frontend (en formato JSON) y llama a
    la base de datos para guardarlos.
    """
    data = request.json or {}
    id_jugador = data.get("player_id")
    personaje = data.get("character")
    puntos = data.get("score")
    creditos_iniciales = data.get("credits_initial")
    creditos_finales = data.get("credits_final")

    # Validaciones básicas
    if not id_jugador or not personaje or creditos_iniciales is None or creditos_finales is None:
        return jsonify({"status": "error", "message": "Faltan datos"}), 400

    guardada = database.guardar_partida(
        id_jugador, personaje, puntos, creditos_iniciales, creditos_finales
    )
    if not guardada:
        return jsonify({"status": "error", "message": "Jugador no encontrado"}), 400
    return jsonify({"status": "success", "message": "Partida guardada exitosamente"})

@app.route("/api/ranking", methods=["GET"])
def obtener_ranking():
    """
    Devuelve los mejores puntajes históricos desde la base de datos
    para que el frontend los muestre.
    """
    ranking_data = database.obtener_ranking()
    return jsonify(ranking_data)

@app.route("/")
def home():
    return send_from_directory(FRONTEND_DIR, "index.html")

if __name__ == "__main__":
    # Preparamos la base de datos local a partir de la plantilla del repo.
    database.preparar_base_datos()
    database.inicializar_catalogo()

    print("\n" + "=" * 50)
    print("SERVIDOR LUDO-MANIA INICIADO")
    print("Abre el juego en: http://127.0.0.1:5000")
    print("Deja esta ventana abierta mientras juegas.")
    print("=" * 50 + "\n")

    app.run(debug=False, port=5000, use_reloader=False)
