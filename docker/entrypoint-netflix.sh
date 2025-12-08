#!/bin/sh
set -e

# Change to /app directory where package.json and pnpm scripts are located
cd /app

echo "🔄 Running Prisma migrations..."
pnpm prisma:netflix:deploy

echo "✅ Migrations completed"
echo "🚀 Starting application..."

# Change to app-dist directory where main.js is located 
cd /app/app-dist

exec "$@"
