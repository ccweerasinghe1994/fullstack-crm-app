# Multi-stage Dockerfile for CRM API
# Stage 1: Dependencies
FROM node:24.1.0-alpine AS deps

# Install pnpm
RUN corepack enable && corepack prepare pnpm@10.11.0 --activate

# Set working directory
WORKDIR /app

# Copy workspace configuration
COPY pnpm-workspace.yaml ./
COPY pnpm-lock.yaml ./
COPY package.json ./

# Copy package.json files for all workspaces
COPY apps/api/package.json ./apps/api/
COPY packages/shared/package.json ./packages/shared/

# Install dependencies (production only)
RUN pnpm install --frozen-lockfile --prod

# Stage 2: Build
FROM node:24.1.0-alpine AS builder

# Install pnpm
RUN corepack enable && corepack prepare pnpm@10.11.0 --activate

WORKDIR /app

# Copy workspace configuration
COPY pnpm-workspace.yaml ./
COPY pnpm-lock.yaml ./
COPY package.json ./

# Copy package.json files
COPY apps/api/package.json ./apps/api/
COPY packages/shared/package.json ./packages/shared/

# Install all dependencies (including dev dependencies for building)
RUN pnpm install --frozen-lockfile

# Copy source code
COPY packages/shared ./packages/shared
COPY apps/api ./apps/api

# Build API
WORKDIR /app/apps/api

# Set dummy DATABASE_URL for Prisma generation (not used for actual connection during build)
ENV DATABASE_URL="postgresql://dummy:dummy@localhost:5432/dummy"

# Generate Prisma Client
RUN pnpm prisma:generate

# Generate TSOA routes and specs
RUN pnpm tsoa:gen

# Build TypeScript
RUN pnpm build

# Stage 3: Production
FROM node:24.1.0-alpine AS production

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

WORKDIR /app

# Copy production dependencies from deps stage
COPY --from=deps --chown=nodejs:nodejs /app/node_modules ./node_modules
COPY --from=deps --chown=nodejs:nodejs /app/apps/api/node_modules ./apps/api/node_modules
COPY --from=deps --chown=nodejs:nodejs /app/packages/shared/node_modules ./packages/shared/node_modules

# Copy built application from builder stage
COPY --from=builder --chown=nodejs:nodejs /app/apps/api/dist ./apps/api/dist
COPY --from=builder --chown=nodejs:nodejs /app/apps/api/prisma ./apps/api/prisma
COPY --from=builder --chown=nodejs:nodejs /app/packages/shared/src ./packages/shared/src

# Copy Prisma generated client to both locations (src and dist for runtime)
COPY --from=builder --chown=nodejs:nodejs /app/apps/api/src/generated ./apps/api/src/generated
COPY --from=builder --chown=nodejs:nodejs /app/apps/api/src/generated ./apps/api/dist/generated

# Copy necessary config files
COPY --from=builder --chown=nodejs:nodejs /app/apps/api/package.json ./apps/api/
COPY --from=builder --chown=nodejs:nodejs /app/apps/api/tsconfig.json ./apps/api/
COPY --from=builder --chown=nodejs:nodejs /app/packages/shared/package.json ./packages/shared/
COPY --from=builder --chown=nodejs:nodejs /app/packages/shared/tsconfig.json ./packages/shared/
COPY --from=builder --chown=nodejs:nodejs /app/package.json ./
COPY --from=builder --chown=nodejs:nodejs /app/pnpm-workspace.yaml ./

# Set environment
ENV NODE_ENV=production
ENV PORT=3000

# Create logs directory
RUN mkdir -p /app/apps/api/logs && chown -R nodejs:nodejs /app/apps/api/logs

# Switch to non-root user
USER nodejs

WORKDIR /app/apps/api

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
    CMD node -e "require('http').get('http://localhost:3000/health', (r) => { process.exit(r.statusCode === 200 ? 0 : 1); });"

# Use dumb-init to handle signals properly
ENTRYPOINT ["dumb-init", "--"]

# Start the application with tsx to handle TypeScript imports from @crm/shared
CMD ["npx", "tsx", "dist/index.js"]

