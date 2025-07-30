#!/bin/bash

set -e

echo "🧹 Cleaning build directory..."
rm -rf dist

echo "📦 Compiling TypeScript..."
./node_modules/.bin/tsc

echo "🔗 Resolving path aliases..."
./node_modules/.bin/tsc-alias

echo "📂 Copying additional files..."
if [ -d "src/prisma/generated" ]; then
  mkdir -p dist/prisma
  cp -r src/prisma/generated dist/prisma/generated
  echo "   ✅ Copied Prisma generated files"
fi

# Copy any other necessary files
if [ -f "src/.env.example" ]; then
  cp src/.env.example dist/.env.example
  echo "   ✅ Copied .env.example"
fi

echo "✨ Build completed successfully!"
echo "🚀 Run 'npm start' to start the application"