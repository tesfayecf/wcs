#!/bin/bash

# Function to cleanup on exit
cleanup() {
    echo "Terminal is closing, stopping service..."
    # Stop the service
    sudo emqx stop
    exit 0
}

# Replace with your service name (e.g., docker, postgresql)
SERVICE_NAME="emqx"

# Set up trap to catch terminal close
trap cleanup EXIT SIGINT SIGTERM

# Start the service
echo "Starting $SERVICE_NAME..."
sudo emqx start

# Keep the terminal open
while true; do
    echo "$SERVICE_NAME is running. Close this terminal to stop the service."
    sleep 60
done
