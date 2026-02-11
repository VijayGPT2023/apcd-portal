#!/bin/sh
echo "=== Web service starting ==="
echo "Node: $(node --version)"
echo "PWD: $(pwd)"
echo "Original HOSTNAME env: ${HOSTNAME}"
echo "Original PORT env: ${PORT}"

# Docker overrides HOSTNAME to container ID — force 0.0.0.0 for external access
export HOSTNAME=0.0.0.0

# Force PORT=4000 to match railway.toml internalPort=4000
# Railway may inject a different PORT at runtime which would cause 502
export PORT=4000

echo "Binding to: ${HOSTNAME}:${PORT}"

# Copy static files (redundant if Dockerfile already did this, but safe)
cp -r apps/web/.next/static apps/web/.next/standalone/apps/web/.next/static 2>/dev/null || true
cp -r apps/web/public apps/web/.next/standalone/apps/web/public 2>/dev/null || true

# List standalone directory for debugging
echo "=== Standalone directory structure ==="
ls -la apps/web/.next/standalone/ 2>/dev/null || echo "standalone dir missing"
ls -la apps/web/.next/standalone/apps/web/ 2>/dev/null || echo "apps/web dir missing"

# Verify server.js exists
if [ ! -f apps/web/.next/standalone/apps/web/server.js ]; then
  echo "ERROR: server.js not found at apps/web/.next/standalone/apps/web/server.js"
  echo "Checking for server.js in other locations..."
  find apps/web/.next/standalone -name "server.js" 2>/dev/null || echo "No server.js found anywhere"
  exit 1
fi

echo "Starting Next.js standalone server..."
exec node apps/web/.next/standalone/apps/web/server.js 2>&1
