"""
Inicia el servidor de LUDO-MANIA y abre el juego en el navegador.
No hace falta abrir VS Code ni ejecutar app.py a mano.
"""
import os
import socket
import subprocess
import sys
import time
import webbrowser

ROOT = os.path.dirname(os.path.abspath(__file__))
HOST = "127.0.0.1"
PORT = 5000
URL = f"http://{HOST}:{PORT}"


def servidor_encendido():
    try:
        with socket.create_connection((HOST, PORT), timeout=0.5):
            return True
    except OSError:
        return False


def iniciar_servidor():
    app_py = os.path.join(ROOT, "backend", "app.py")
    kwargs = {
        "args": [sys.executable, app_py],
        "cwd": os.path.join(ROOT, "backend"),
    }
    if os.name == "nt":
        kwargs["creationflags"] = subprocess.CREATE_NEW_CONSOLE
    subprocess.Popen(**kwargs)


def esperar_servidor():
    for _ in range(40):
        if servidor_encendido():
            return True
        time.sleep(0.25)
    return False


def main():
    if not servidor_encendido():
        print("Encendiendo el servidor de LUDO-MANIA...")
        iniciar_servidor()
        if not esperar_servidor():
            print("No se pudo iniciar el servidor. Revisa que Python y Flask estén instalados.")
            input("Presiona Enter para salir...")
            sys.exit(1)
    else:
        print("El servidor ya estaba encendido.")

    print(f"Abriendo el juego en {URL}")
    webbrowser.open(URL)


if __name__ == "__main__":
    main()
