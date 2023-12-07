#!/bin/bash
set -e
set -x

# Check if a specific file exists as a proxy for having run a command
if [ ! -f "/app/first_command_complete" ]; then
    # Mark that the first command has been run
    touch /app/first_command_complete
fi

# Execute command passed from docker-compose or Docker command
exec "$@"
