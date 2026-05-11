#!/bin/bash

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

cleanup() {
	kill "$BACKEND_PID" "$FRONTEND_PID" 2>/dev/null || true
	exit
}

# Start backend in background
echo "Starting backend..."
cd "$SCRIPT_DIR/e-commerce-backend"
./mvnw spring-boot:run &
BACKEND_PID=$!

# Start frontend in background
echo "Starting frontend..."
cd "$SCRIPT_DIR/e-commerce-frontend"
npm run dev &
FRONTEND_PID=$!

echo "Backend PID: $BACKEND_PID | Frontend PID: $FRONTEND_PID"
echo "Press Ctrl+C to stop both servers."

# Wait and forward Ctrl+C to both processes
trap cleanup INT TERM
wait
