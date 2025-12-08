# Multi-stage Dockerfile for NX Monorepo Microservices
# Usage: docker build --build-arg APP_NAME=api-gateway -t nx-micro/api-gateway .

ARG NODE_VERSION=20-slim

# ============================================
# Stage 1: Dependencies
# ============================================
FROM node:${NODE_VERSION} AS dependencies

WORKDIR /app

# Install pnpm
RUN npm install -g pnpm@latest

# Copy package files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# ============================================
# Stage 2: Builder
# ============================================
FROM node:${NODE_VERSION} AS builder

WORKDIR /app

# Install pnpm
RUN npm install -g pnpm@latest

# Copy dependencies from previous stage
COPY --from=dependencies /app/node_modules ./node_modules

# Copy all source files
COPY . .

# Build argument for app name
ARG APP_NAME
ENV APP_NAME=${APP_NAME}

# Generate Prisma clients
RUN pnpm prisma:generate:all || true

# Build the specific app using NX
RUN npx nx build ${APP_NAME} --prod

# ============================================
# Stage 3: Production
# ============================================
FROM node:${NODE_VERSION} AS production

WORKDIR /app

# Install required dependencies for Prisma
RUN apt-get update && apt-get install -y \
    openssl \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# Install pnpm
RUN npm install -g pnpm@latest

# Build argument for app name
ARG APP_NAME
ENV APP_NAME=${APP_NAME}

# Copy package files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# Copy Prisma schema files BEFORE installing dependencies
COPY libs/test_micro/prisma ./libs/test_micro/prisma
COPY libs/prisma-netflix/prisma ./libs/prisma-netflix/prisma

# Install ALL dependencies (including devDependencies for Prisma CLI)
RUN pnpm install --frozen-lockfile

# Generate Prisma clients in production stage
RUN pnpm prisma:generate:all

# Copy built application from builder directly to /app
COPY --from=builder /app/dist/apps/${APP_NAME} ./app-dist

# Copy entrypoint scripts
COPY docker/entrypoint-*.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/entrypoint-*.sh

# Create non-root user for security
RUN groupadd -g 1001 nodejs && \
    useradd -r -u 1001 -g nodejs nodejs

# Change ownership of app files
RUN chown -R nodejs:nodejs /app

# Switch to the directory where main.js is located
WORKDIR /app/app-dist

# Switch to non-root user
USER nodejs

# Expose port (will be overridden by docker-compose)
EXPOSE 3000

# Health check
# HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
#     CMD node -e "require('http').get('http://localhost:3000/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})" || exit 1

# Entrypoint will be set in docker-compose for each service
# Start the application
CMD ["node", "main.js"]
