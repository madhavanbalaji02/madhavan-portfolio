#!/bin/bash
# Refresh tech news and push to Cloudflare KV
# Runs at 7 AM daily via launchd

set -e

PORTFOLIO_DIR="/Users/madhavanbalaji/Documents/portfolio"
SERVER_DIR="$PORTFOLIO_DIR/server"
LOG_FILE="$SERVER_DIR/refresh.log"

echo "--- $(date) ---" >> "$LOG_FILE"

# Run the refresh script (fetches RSS + calls Claude)
/opt/homebrew/bin/node "$SERVER_DIR/refresh.js" >> "$LOG_FILE" 2>&1

# Push to Cloudflare KV
cd "$PORTFOLIO_DIR/worker"
/opt/homebrew/bin/npx wrangler kv:key put "tech-news-v4" \
  --path=/tmp/news-data.json \
  --namespace-id=f6b14e3952cc488fb049dd2266a45ff2 \
  --ttl=90000 >> "$LOG_FILE" 2>&1

echo "Push complete" >> "$LOG_FILE"
