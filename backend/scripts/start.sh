#!/bin/bash

# Start the Daphne server
cd /backend
daphne backend.asgi:application &

# Wait for Daphne to start (adjust the sleep time as needed)
sleep 5

# Run the subscribe command (replace with your actual command)
python manage.py subscribe

# You can add more commands to run after Daphne starts, if needed

# Keep the script running
wait
