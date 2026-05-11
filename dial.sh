#!/bin/bash

# Stargate Dialer Server Controller
# Senior Developer/Fan Edition

PORT=3000
SERVER_FILE="server.js"

echo "======================================"
echo "    STARGATE COMMAND - SYSTEM BOOT"
echo "======================================"

# Check if port is in use
PID=$(lsof -t -i:$PORT)

if [ -n "$PID" ]; then
    echo "> [INFO] Server already running (PID: $PID). Restarting..."
    kill -9 $PID
    sleep 1
else
    echo "> [INFO] Initiating cold start..."
fi

echo "> [SYSTEM] Loading GDO frequencies..."
echo "> [SYSTEM] Initializing SQLite protocols..."

# Start the server in the background
nohup node $SERVER_FILE > server.log 2>&1 &

NEW_PID=$!

if [ $? -eq 0 ]; then
    echo "> [SUCCESS] Stargate Dialer Online."
    echo "> [URL] http://localhost:$PORT"
    echo "> [PID] $NEW_PID"
    echo "> [LOG] server.log"
else
    echo "> [CRITICAL] System failure. Check logs."
fi

echo "======================================"
