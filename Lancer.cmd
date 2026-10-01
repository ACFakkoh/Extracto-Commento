@echo off
cd /d "%~dp0"
set "EXTRACTO_NODE=node"
where node >nul 2>nul
if errorlevel 1 (
  if exist "%USERPROFILE%\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe" (
    set "EXTRACTO_NODE=%USERPROFILE%\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe"
  ) else (
    echo Node.js est requis pour lancer le serveur local. Voir README.md.
    pause
    exit /b 1
  )
)
"%EXTRACTO_NODE%" server.mjs --open
pause
