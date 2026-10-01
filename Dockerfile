# =============================================================================
# Multi-Stage Production Dockerfile for KRADIND Adventures Monorepo
# Framework: Next.js 15 (Node.js 20 Alpine)
# Package Manager: pnpm (Workspace Mode)
# =============================================================================

# -----------------------------------------------------------------------------
# Stage 1: Base Alpine Image with Node.js & pnpm
# -----------------------------------------------------------------------------
FROM node:20-alpine AS base

RUN apk add --no-cache libc6-compat wget

WORKDIR /app

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable && corepack prepare pnpm@9.15.4 --activate

# -----------------------------------------------------------------------------
# Stage 2: Dependencies Cache Stage
# -----------------------------------------------------------------------------
FROM base AS deps

# Copy root workspace manifests
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml .npmrc ./

# Copy all workspace package definitions for lockfile resolution
COPY artifacts/kradind-adventures/package.json ./artifacts/kradind-adventures/
COPY lib/api-zod/package.json ./lib/api-zod/
COPY lib/api-client-react/package.json ./lib/api-client-react/
COPY lib/api-spec/package.json ./lib/api-spec/
COPY lib/db/package.json ./lib/db/
COPY scripts/package.json ./scripts/

# Install dependencies matching workspace
RUN pnpm install

# -----------------------------------------------------------------------------
# Stage 3: Builder Stage
# -----------------------------------------------------------------------------
FROM base AS builder

WORKDIR /app

# Copy cached dependencies from deps stage
COPY --from=deps /app ./

# Copy the entire source code (excluding items in .dockerignore)
COPY . .

# Set environment flags for build
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Compile Next.js 15 production build and prune build cache to keep image slim
RUN pnpm --filter @workspace/kradind-adventures run build && \
    rm -rf artifacts/kradind-adventures/.next/cache

# -----------------------------------------------------------------------------
# Stage 4: Production Runner (Lean, Secure Non-Root Runtime)
# -----------------------------------------------------------------------------
FROM base AS runner

WORKDIR /app/artifacts/kradind-adventures

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Create unprivileged system user for running the server
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copy the built application workspace tree with proper ownership
COPY --from=builder --chown=nextjs:nodejs /app /app

# Prepare runtime writable directories for CMS data and uploads
RUN mkdir -p /app/artifacts/kradind-adventures/public/uploads && \
    mkdir -p /app/artifacts/kradind-adventures/data && \
    chown -R nextjs:nodejs /app/artifacts/kradind-adventures/data && \
    chown -R nextjs:nodejs /app/artifacts/kradind-adventures/public/uploads

# Switch to non-root user
USER nextjs

# Expose Next.js server port
EXPOSE 3000

# Automated container healthcheck
HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://127.0.0.1:3000/api/healthz || exit 1

# Start production server directly via Next.js JavaScript entrypoint
CMD ["node", "node_modules/next/dist/bin/next", "start", "-p", "3000", "-H", "0.0.0.0"]
