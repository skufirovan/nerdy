#!/bin/bash

echo "🚀 Starting development server..."
echo "📁 Watching: src/"
echo "🔄 Auto-restart on file changes"
echo ""

# Use tsx for development with path resolution
./node_modules/.bin/nodemon \
  --watch src \
  --ext ts,js,json \
  --ignore "src/**/*.test.ts" \
  --ignore "src/**/*.spec.ts" \
  --exec "./node_modules/.bin/tsx --tsconfig tsconfig.json src/main.ts" \
  --delay 1000ms