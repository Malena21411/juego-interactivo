# pyrefly: ignore [missing-import]
from flask import Flask, request, jsonify
from flask_cors import CORS
import database

app = Flask(__name__)
# CORS permite que el frontend (tu HTML) se comunique con este backend 
# sin bloqueos de seguridad del navegador.
CORS(app)

@app.route('/api/guardar_partida', methods=['POST'])
def guardar_partida():
    """
    Recibe los datos del frontend (en formato JSON) y llama a 
    la base de datos para guardarlos.
    """
    data = request.json
    nombre = data.get('name')
    personaje = data.get('character')
    puntos = data.get('score')
    
    # Validaciones básicas
    if not nombre or not personaje:
        return jsonify({"status": "error", "message": "Faltan datos"}), 400
        
    database.guardar_partida(nombre, personaje, puntos)
    return jsonify({"status": "success", "message": "Partida guardada exitosamente"})

@app.route('/api/ranking', methods=['GET'])
def obtener_ranking():
    """
    Devuelve los mejores puntajes históricos desde la base de datos
    para que el frontend los muestre.
    """
    ranking_data = database.obtener_ranking()
    return jsonify(ranking_data)

@app.route('/')
def home():
    return "¡El servidor API de LUDO-MANIA está funcionando correctamente! Abre tu archivo index.html en el navegador para jugar."

if __name__ == '__main__':
    # Nos aseguramos de que la base de datos esté creada al iniciar el servidor
    database.crear_base_datos()
    database.inicializar_catalogo()
    
    print("\n" + "="*50)
    print("SERVIDOR LUDO-MANIA INICIADO")
    print("El servidor esta escuchando en: http://127.0.0.1:5000")
    print("Deja esta ventana abierta mientras juegas.")
    print("="*50 + "\n")
    
    app.run(debug=True, port=5000)
