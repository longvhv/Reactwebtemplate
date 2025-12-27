#!/bin/sh
set -e

# Runtime environment variable injection for containerized React apps
# This script replaces placeholders in the built JS files with actual environment variables

echo "Starting React Microservice Frontend..."
echo "Service: ${VITE_SERVICE_NAME:-react-frontend}"
echo "Environment: ${VITE_ENV:-development}"

# Path to the built app
APP_DIR=/usr/share/nginx/html

# Find main JS file (Vite typically generates index-*.js)
MAIN_JS_FILE=$(find ${APP_DIR}/assets -name 'index-*.js' 2>/dev/null | head -1)

if [ -n "$MAIN_JS_FILE" ]; then
    echo "Found main JS file: $MAIN_JS_FILE"
    
    # Create a temporary file for replacements
    TEMP_FILE="${MAIN_JS_FILE}.tmp"
    
    # Replace environment variables (if they exist as placeholders)
    # Note: This is optional and only needed if you want runtime env var replacement
    # For Vite, env vars are typically baked in at build time
    
    echo "Environment variables:"
    echo "  VITE_API_GATEWAY_URL: ${VITE_API_GATEWAY_URL:-not set}"
    echo "  VITE_SERVICE_NAME: ${VITE_SERVICE_NAME:-not set}"
    echo "  VITE_SERVICE_VERSION: ${VITE_SERVICE_VERSION:-not set}"
    echo "  VITE_ENV: ${VITE_ENV:-not set}"
else
    echo "Warning: Could not find main JS file for environment variable injection"
fi

# Create runtime config file that can be loaded by the app
cat > ${APP_DIR}/config.js <<EOF
window.__RUNTIME_CONFIG__ = {
    VITE_API_GATEWAY_URL: "${VITE_API_GATEWAY_URL:-/api}",
    VITE_SERVICE_NAME: "${VITE_SERVICE_NAME:-react-frontend}",
    VITE_SERVICE_VERSION: "${VITE_SERVICE_VERSION:-1.0.0}",
    VITE_ENV: "${VITE_ENV:-production}",
    VITE_ENABLE_SERVICE_DISCOVERY: "${VITE_ENABLE_SERVICE_DISCOVERY:-false}",
    VITE_ENABLE_MONITORING: "${VITE_ENABLE_MONITORING:-true}",
    VITE_ENABLE_LOGGING: "${VITE_ENABLE_LOGGING:-true}",
};
EOF

echo "Runtime configuration created at ${APP_DIR}/config.js"

# Update health check with actual service info
cat > ${APP_DIR}/health.json <<EOF
{
  "status": "healthy",
  "service": "${VITE_SERVICE_NAME:-react-frontend}",
  "version": "${VITE_SERVICE_VERSION:-1.0.0}",
  "environment": "${VITE_ENV:-production}",
  "timestamp": "$(date -u +%Y-%m-%dT%H:%M:%SZ)"
}
EOF

echo "Health check endpoint updated"
echo "Starting Nginx..."

# Execute the main container command
exec "$@"
