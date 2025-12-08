#!/bin/bash
# Docker utility script for Linux/Mac
# Usage: ./docker-utils.sh [command]

set -e

show_help() {
    echo "Usage: ./docker-utils.sh [command]"
    echo ""
    echo "Available commands:"
    echo "  build       - Build all Docker images"
    echo "  up          - Start all services"
    echo "  down        - Stop all services"
    echo "  restart     - Restart all services"
    echo "  logs        - Show logs from all services"
    echo "  ps          - Show running containers"
    echo "  clean       - Remove all containers and volumes"
    echo "  migrate     - Run database migrations"
    echo "  seed        - Seed databases with initial data"
}

if [ -z "$1" ]; then
    show_help
    exit 1
fi

case "$1" in
    build)
        echo "Building all Docker images..."
        docker-compose build
        ;;
    up)
        echo "Starting all services..."
        docker-compose up -d
        ;;
    down)
        echo "Stopping all services..."
        docker-compose down
        ;;
    restart)
        echo "Restarting all services..."
        docker-compose restart
        ;;
    logs)
        docker-compose logs -f
        ;;
    ps)
        docker-compose ps
        ;;
    clean)
        echo "WARNING: This will remove all containers and volumes!"
        read -p "Are you sure? (y/N): " confirm
        if [ "$confirm" = "y" ] || [ "$confirm" = "Y" ]; then
            docker-compose down -v
            docker system prune -f
            echo "Cleanup complete!"
        else
            echo "Cleanup cancelled."
        fi
        ;;
    migrate)
        echo "Running database migrations..."
        docker-compose exec api-auth pnpm prisma:test_micro:migrate
        docker-compose exec netflix pnpm prisma:netflix:migrate
        echo "Migrations complete!"
        ;;
    seed)
        echo "Copying seed files to container..."
        docker cp libs/prisma-netflix/seed.ts nx-micro-netflix:/app/app-dist/seed.ts
        docker cp libs/prisma-netflix/netflix_shows.sql nx-micro-netflix:/app/app-dist/netflix_shows.sql
        docker cp libs/prisma-netflix/tsconfig.docker-seed.json nx-micro-netflix:/app/app-dist/tsconfig.seed.json

        echo "Fixing permissions..."
        docker-compose exec -u 0 netflix chown nodejs:nodejs seed.ts netflix_shows.sql tsconfig.seed.json

        echo "Seeding databases..."
        docker-compose exec netflix npx ts-node --project tsconfig.seed.json seed.ts

        echo "Cleaning up..."
        docker-compose exec netflix rm -f seed.ts netflix_shows.sql tsconfig.seed.json
        
        echo "Seeding complete!"
        ;;
    *)
        echo "Unknown command: $1"
        show_help
        exit 1
        ;;
esac
