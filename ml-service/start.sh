#!/bin/bash
# Load environment variables and start ML service

# Load config.env if it exists
if [ -f "config.env" ]; then
    echo "Loading environment variables from config.env..."
    export $(cat config.env | grep -v '^#' | xargs)
fi

# Start uvicorn server
echo "Starting ML Service..."
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
