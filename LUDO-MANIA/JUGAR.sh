#!/bin/bash

# Cambiar al directorio donde está este script
cd "$(dirname "$0")"

# Intentar ejecutar con python3.13
if command -v python3.13 &> /dev/null; then
    python3.13 iniciar_juego.py
    exit $?
fi

# Intentar con python3
if command -v python3 &> /dev/null; then
    python3 iniciar_juego.py
    exit $?
fi

# Intentar con python
if command -v python &> /dev/null; then
    python iniciar_juego.py
    exit $?
fi

# Si no se encuentra Python
echo ""
echo "No se encontro Python. Instala Python y asegurate de que este en el PATH."
read -p "Presiona Enter para salir..."