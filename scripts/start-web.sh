#!/bin/sh
echo "=== Web service starting ==="
echo "Node: $(node --version)"
echo "PWD: $(pwd)"
echo "Original HOSTNAME env: ${HOSTNAME}"
echo "Original PORT env: ${PORT}"

# Docker overrides HOSTNAME to container ID — force 0.0.0.0 for external access
export HOSTNAME=0.0.0.0

# Use PORT from Railway or default to 4000 (matching railway.toml internalPort)
export PORT=${PORT:-4000}

echo "Binding to: ${HOSTNAME}:${PORT}"

# Copy static files (redundant if Dockerfile already did this, but safe)
cp -r apps/web/.next/static apps/web/.next/standalone/apps/web/.next/static 2>/dev/null || true
cp -r apps/web/public apps/web/.next/standalone/apps/web/public 2>/dev/null || true

# Verify server.js exists
if [ ! -f apps/web/.next/standalone/apps/web/server.js ]; then
  echo "ERROR: server.js not found at apps/web/.next/standalone/apps/web/server.js"
  ls -la apps/web/.next/standalone/ 2>/dev/null || echo "standalone dir missing"
  exit 1
fi

echo "Starting Next.js standalone server..."
exec node apps/web/.next/standalone/apps/web/server.js
