#!/bin/bash
set -e
set -x

# Check if a specific file exists as a proxy for having run a command
if [ ! -f "/app/second_command_complete" ]; then
    # Mark that the second command has been run
    touch /app/second_command_complete
fi

# Execute command passed from docker-compose or Docker command
exec "$@"
