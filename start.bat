@echo off
echo ===================================================
echo   Aetheria Knowledge Platform - Startup
echo ===================================================
echo.

where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not installed or not in PATH!
    echo Please install Node.js (version 18 or higher) from https://nodejs.org
    pause
    exit /b 1
)

if not exist "node_modules\" (
    echo [INFO] Installing dependencies (first run)...
    call npm install
    if %errorlevel% neq 0 (
        echo [ERROR] npm install failed.
        pause
        exit /b 1
    )
)

echo [INFO] Starting Aetheria Knowledge Platform...
echo [INFO] Open your browser at: http://localhost:3000
echo.
call npm run dev
pause
