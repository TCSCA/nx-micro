@echo off
REM Docker utility script for Windows
REM Usage: docker-utils.bat [command]

IF "%1"=="" (
    echo Usage: docker-utils.bat [command]
    echo.
    echo Available commands:
    echo   build       - Build all Docker images
    echo   up          - Start all services
    echo   down        - Stop all services
    echo   restart     - Restart all services
    echo   logs        - Show logs from all services
    echo   ps          - Show running containers
    echo   clean       - Remove all containers and volumes
    echo   migrate     - Run database migrations
    echo   seed        - Seed databases with initial data
    exit /b 1
)

IF "%1"=="build" (
    echo Building all Docker images...
    docker-compose build
    exit /b 0
)

IF "%1"=="up" (
    echo Starting all services...
    docker-compose up -d
    exit /b 0
)

IF "%1"=="down" (
    echo Stopping all services...
    docker-compose down
    exit /b 0
)

IF "%1"=="restart" (
    echo Restarting all services...
    docker-compose restart
    exit /b 0
)

IF "%1"=="logs" (
    docker-compose logs -f
    exit /b 0
)

IF "%1"=="ps" (
    docker-compose ps
    exit /b 0
)

IF "%1"=="clean" (
    echo WARNING: This will remove all containers and volumes!
    set /p confirm="Are you sure? (y/N): "
    IF /I "%confirm%"=="y" (
        docker-compose down -v
        docker system prune -f
        echo Cleanup complete!
    ) ELSE (
        echo Cleanup cancelled.
    )
    exit /b 0
)

IF "%1"=="migrate" (
    echo Running database migrations...
    docker-compose exec api-auth pnpm prisma:test_micro:migrate
    docker-compose exec netflix pnpm prisma:netflix:migrate
    echo Migrations complete!
    exit /b 0
)


IF "%1"=="seed" (
    echo Copying seed files to container...
    docker cp libs/prisma-netflix/seed.ts nx-micro-netflix:/app/app-dist/seed.ts
    docker cp libs/prisma-netflix/netflix_shows.sql nx-micro-netflix:/app/app-dist/netflix_shows.sql
    docker cp libs/prisma-netflix/tsconfig.docker-seed.json nx-micro-netflix:/app/app-dist/tsconfig.seed.json
    
    echo Fixing permissions...
    docker-compose exec -u 0 netflix chown nodejs:nodejs seed.ts netflix_shows.sql tsconfig.seed.json

    echo Seeding databases...
    docker-compose exec netflix npx ts-node --project tsconfig.seed.json seed.ts
    
    echo Cleaning up...
    docker-compose exec netflix rm -f seed.ts netflix_shows.sql tsconfig.seed.json
    
    echo Seeding complete!
    exit /b 0
)

echo Unknown command: %1
exit /b 1
