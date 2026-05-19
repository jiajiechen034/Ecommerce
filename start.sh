#!/bin/bash

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKEND_URL="http://localhost:8080"
FRONTEND_URL="http://localhost:5173"
BACKEND_PORT=8080
FRONTEND_PORT=5173
BACKEND_PID=""
FRONTEND_PID=""
STARTED_BACKEND=0
STARTED_FRONTEND=0

open_browser() {
	local url="$1"
	if command -v open >/dev/null 2>&1; then
		open "$url"
	elif command -v xdg-open >/dev/null 2>&1; then
		xdg-open "$url"
	elif command -v start >/dev/null 2>&1; then
		start "$url"
	else
		echo "Could not detect a browser opener. Open this URL manually: $url"
	fi
}

wait_for_url() {
	local name="$1"
	local url="$2"
	local pid="$3"
	local timeout_seconds="${4:-120}"
	local elapsed=0

	echo "Waiting for $name at $url ..."
	while (( elapsed < timeout_seconds )); do
		if [[ -n "$pid" ]] && ! kill -0 "$pid" 2>/dev/null; then
			echo "$name process exited before it became ready."
			return 1
		fi

		# For readiness, any HTTP response means the server is reachable.
		if curl --silent "$url" >/dev/null 2>&1; then
			echo "$name is ready."
			return 0
		fi

		sleep 1
		((elapsed += 1))
	done

	echo "Timed out waiting for $name at $url"
	return 1
}

is_port_in_use() {
	local port="$1"
	lsof -nP -iTCP:"$port" -sTCP:LISTEN >/dev/null 2>&1
}

cleanup() {
	if [[ "$STARTED_BACKEND" -eq 1 && -n "$BACKEND_PID" ]]; then
		kill "$BACKEND_PID" 2>/dev/null || true
	fi
	if [[ "$STARTED_FRONTEND" -eq 1 && -n "$FRONTEND_PID" ]]; then
		kill "$FRONTEND_PID" 2>/dev/null || true
	fi
	exit
}

# Start backend in background
if is_port_in_use "$BACKEND_PORT"; then
	echo "Backend port $BACKEND_PORT already in use. Assuming backend is already running."
else
	echo "Starting backend..."
	cd "$SCRIPT_DIR/e-commerce-backend"
	./mvnw spring-boot:run &
	BACKEND_PID=$!
	STARTED_BACKEND=1
fi

# Start frontend in background
if is_port_in_use "$FRONTEND_PORT"; then
	echo "Frontend port $FRONTEND_PORT already in use. Assuming frontend is already running."
else
	echo "Starting frontend..."
	cd "$SCRIPT_DIR/e-commerce-frontend"
	npm run dev &
	FRONTEND_PID=$!
	STARTED_FRONTEND=1
fi

echo "Backend PID: $BACKEND_PID | Frontend PID: $FRONTEND_PID"

wait_for_url "Backend" "$BACKEND_URL" "$BACKEND_PID"
wait_for_url "Frontend" "$FRONTEND_URL" "$FRONTEND_PID"

echo "Both servers are running. Opening shop in browser..."
open_browser "$FRONTEND_URL"

echo "Press Ctrl+C to stop both servers."

# Wait and forward Ctrl+C to both processes
trap cleanup INT TERM
wait
