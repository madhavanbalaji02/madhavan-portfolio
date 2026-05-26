#!/usr/bin/env bash
# Starts both the React frontend (port 3000) and the news API server (port 3001).
# Requires: server/.env with ANTHROPIC_API_KEY set (copy from server/.env.example).

set -e

if [ ! -f server/.env ]; then
  echo "⚠  server/.env not found. Copy server/.env.example and add your ANTHROPIC_API_KEY."
  exit 1
fi

if [ ! -d server/node_modules ]; then
  echo "Installing server dependencies..."
  (cd server && npm install)
fi

echo "Starting React frontend + tech news API..."
npx concurrently \
  --names "frontend,api" \
  --prefix-colors "cyan,green" \
  "npm start" \
  "cd server && node index.js"
