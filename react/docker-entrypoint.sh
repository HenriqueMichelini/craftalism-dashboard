#!/bin/sh

# This script allows runtime injection of environment variables into the built React app
# Useful for configuring API URLs and other settings without rebuilding the image

set -e

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
