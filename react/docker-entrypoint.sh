#!/bin/sh

# This script allows runtime injection of environment variables into the built React app
# Useful for configuring API URLs and other settings without rebuilding the image

set -e

# Default API upstream for nginx reverse-proxy (Docker network service name)
: "${API_UPSTREAM_URL:=http://craftalism-api:8080}"

# If runtime API URL points to localhost, force same-origin /api to prevent browser CORS issues.
case "${VITE_API_URL:-}" in
  http://localhost*|https://localhost*|http://127.0.0.1*|https://127.0.0.1*)
    VITE_API_URL="/api"
    ;;
esac

# Render nginx config template with API upstream target.
envsubst '${API_UPSTREAM_URL}' \
  < /etc/nginx/templates/default.conf.template \
  > /etc/nginx/conf.d/default.conf

# Define environment variables that should be available in the app
# Add any VITE_ prefixed variables you want to inject at runtime
ENV_VARS="VITE_API_URL VITE_API_TIMEOUT"

# Create a temporary JavaScript file with runtime config
cat > /usr/share/nginx/html/runtime-config.js << EOF
window.__RUNTIME_CONFIG__ = {
EOF

# Inject each environment variable
for var in $ENV_VARS; do
    # Get the value, use empty string if not set
    value=$(eval echo \$$var)
    echo "  $var: '$value'," >> /usr/share/nginx/html/runtime-config.js
done

cat >> /usr/share/nginx/html/runtime-config.js << EOF
};
EOF

# Log what we injected (for debugging)
echo "Injected runtime configuration:"
cat /usr/share/nginx/html/runtime-config.js

# Inject the script tag into index.html if not already present
if ! grep -q "runtime-config.js" /usr/share/nginx/html/index.html; then
    # Insert script tag before closing </head>
    sed -i 's|</head>|  <script src="/runtime-config.js"></script>\n  </head>|' /usr/share/nginx/html/index.html
    echo "Added runtime-config.js script tag to index.html"
fi

# Execute the main container command (nginx)
exec "$@"
