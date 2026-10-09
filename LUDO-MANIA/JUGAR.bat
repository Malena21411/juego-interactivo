@echo off
cd /d "%~dp0"

py -3.13 iniciar_juego.py
if %errorlevel%==0 goto :eof

python iniciar_juego.py
if %errorlevel%==0 goto :eof

echo.
echo No se encontro Python. Instala Python y marca "Add Python to PATH".
pause

