# =============================================================================
# Multi-Stage Production Dockerfile for KRADIND Adventures Monorepo
# Framework: Next.js 15 (Node.js 20 Alpine)
# Package Manager: pnpm (Workspace Mode)
# =============================================================================

# -----------------------------------------------------------------------------
# Stage 1: Base Alpine Image with Node.js & pnpm
# -----------------------------------------------------------------------------
FROM node:20-alpine AS base

# Install libc6-compat for compatibility with native modules on Alpine Linux
# Install wget for container healthcheck
RUN apk add --no-cache libc6-compat wget

WORKDIR /app

# Enable Corepack and activate pnpm matching the repository lockfile
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable && corepack prepare pnpm@9.15.4 --activate

# -----------------------------------------------------------------------------
# Stage 2: Dependencies Cache Stage
# -----------------------------------------------------------------------------
FROM base AS deps

# Copy root workspace manifests
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml .npmrc ./

# Copy all workspace package definitions for frozen lockfile resolution
COPY artifacts/kradind-adventures/package.json ./artifacts/kradind-adventures/
COPY lib/api-zod/package.json ./lib/api-zod/
COPY lib/api-client-react/package.json ./lib/api-client-react/
COPY lib/api-spec/package.json ./lib/api-spec/
COPY lib/db/package.json ./lib/db/
COPY scripts/package.json ./scripts/

# Install dependencies strictly following pnpm-lock.yaml
RUN pnpm install --frozen-lockfile

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

# Compile Next.js 15 production build
RUN pnpm --filter @workspace/kradind-adventures run build

# -----------------------------------------------------------------------------
# Stage 4: Production Runner (Lean, Secure Non-Root Runtime)
# -----------------------------------------------------------------------------
FROM base AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Create unprivileged system user for running the server
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copy root workspace metadata and dependencies
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/pnpm-workspace.yaml ./pnpm-workspace.yaml
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/lib ./lib

# Copy compiled Next.js application, public assets, and store data
COPY --from=builder /app/artifacts/kradind-adventures/package.json ./artifacts/kradind-adventures/package.json
COPY --from=builder /app/artifacts/kradind-adventures/node_modules ./artifacts/kradind-adventures/node_modules
COPY --from=builder /app/artifacts/kradind-adventures/.next ./artifacts/kradind-adventures/.next
COPY --from=builder /app/artifacts/kradind-adventures/public ./artifacts/kradind-adventures/public
COPY --from=builder /app/artifacts/kradind-adventures/data ./artifacts/kradind-adventures/data
COPY --from=builder /app/artifacts/kradind-adventures/next.config.ts ./artifacts/kradind-adventures/next.config.ts

# Prepare writable directories for runtime CMS data, uploads, and Next.js ISR cache
RUN mkdir -p /app/artifacts/kradind-adventures/public/uploads && \
    mkdir -p /app/artifacts/kradind-adventures/data && \
    chown -R nextjs:nodejs /app/artifacts/kradind-adventures/data && \
    chown -R nextjs:nodejs /app/artifacts/kradind-adventures/public/uploads && \
    chown -R nextjs:nodejs /app/artifacts/kradind-adventures/.next

# Switch to non-root user
USER nextjs

# Expose Next.js server port
EXPOSE 3000

# Automated container healthcheck
HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://127.0.0.1:3000/api/healthz || exit 1

# Start production server
CMD ["pnpm", "--filter", "@workspace/kradind-adventures", "run", "start"]
