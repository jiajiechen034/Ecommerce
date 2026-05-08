#!/bin/bash

# Start backend in background
echo "Starting backend..."
cd "$(dirname "$0")/e-commerce-backend"
./mvnw spring-boot:run &
BACKEND_PID=$!

# Start frontend in background
echo "Starting frontend..."
cd "$(dirname "$0")/e-commerce-frontend"
npm run dev &
FRONTEND_PID=$!

echo "Backend PID: $BACKEND_PID | Frontend PID: $FRONTEND_PID"
echo "Press Ctrl+C to stop both servers."

# Wait and forward Ctrl+C to both processes
trap "kill $BACKEND_PID $FRONTEND_PID; exit" INT TERM
wait
