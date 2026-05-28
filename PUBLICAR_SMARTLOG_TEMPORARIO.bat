@echo off
set "SITE_DIR=%~dp0"
cd /d "%SITE_DIR%"
set "PYTHONUTF8=1"
set "PY=%SITE_DIR%..\.venv\Scripts\python.exe"
if not exist "%PY%" set "PY=python"
start "SmartLog servidor" "%PY%" server.py
timeout /t 2 /nobreak >nul
if not exist "%SITE_DIR%tools\cloudflared.exe" (
  echo cloudflared.exe nao encontrado em tools.
  echo Eu ja baixei isso neste computador; se voce apagar, rode a preparacao novamente.
  pause
  exit /b 1
)
"%SITE_DIR%tools\cloudflared.exe" tunnel --url http://127.0.0.1:8000
pause
