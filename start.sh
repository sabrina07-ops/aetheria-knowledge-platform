#!/usr/bin/env bash
set -e

echo "==================================================="
echo "  Aetheria Knowledge Platform - Startup"
echo "==================================================="
echo ""

if ! command -v node &> /dev/null; then
    echo "[ERROR] Node.js is not installed or not in PATH."
    echo "Please install Node.js 18+ from https://nodejs.org"
    exit 1
fi

if [ ! -d "node_modules" ]; then
    echo "[INFO] Installing dependencies (first run)..."
    npm install
fi

echo "[INFO] Starting Aetheria Knowledge Platform..."
echo "[INFO] Open your browser at: http://localhost:3000"
echo ""
npm run dev
