#!/bin/bash

# MongoDB Migration Script Runner
# Usage: ./run-migrations.sh

echo "Running MongoDB migrations..."

# Check if mongosh is installed
if ! command -v mongosh &> /dev/null; then
    echo "Error: mongosh is not installed"
    echo "Install with: brew install mongosh (macOS) or apt install mongodb-mongosh (Ubuntu)"
    exit 1
fi

# Load environment variables
if [ -f .env ]; then
    export $(cat .env | grep -v '^#' | xargs)
else
    echo "Warning: .env file not found, using defaults"
    MONGODB_URI="mongodb://localhost:27017"
    MONGODB_DATABASE="vhv_platform"
fi

echo "Database: $MONGODB_DATABASE"
echo "MongoDB URI: $MONGODB_URI"

# Run init migration
echo "Running init.js migration..."
mongosh "$MONGODB_URI/$MONGODB_DATABASE" migrations/init.js

if [ $? -eq 0 ]; then
    echo "✓ Migration completed successfully!"
else
    echo "✗ Migration failed!"
    exit 1
fi

echo "Done!"
