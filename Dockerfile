# Typodeck Web Studio — production image (plain Node server, `next start`).
#
# Build:  docker build -t typodeck .
# Run:    docker run --rm -p 3000:3000 \
#           -e GITHUB_TOKEN="<token, optional>" \
#           -e TYPOdeck_MUSE_ENDPOINT="<endpoint, optional>" \
#           -e TYPOdeck_MUSE_API_KEY="<key, optional>" \
#           typodeck
# Smoke:  curl -s http://localhost:3000/api/catalog | head -c 120
#
# No secrets are baked into the image: everything arrives via environment at
# run time (see docs/ENV.md). The app runs as a non-root user. Health checks
# use GET /api/catalog until the app ships a dedicated /api/health endpoint.

FROM node:22-slim AS deps
WORKDIR /app
COPY package.json package-lock.json ./
COPY packages/core/package.json ./packages/core/
COPY apps/web/package.json ./apps/web/
RUN npm ci --no-audit --no-fund

FROM node:22-slim AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM node:22-slim AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000
# Runtime file set: workspace root (npm workspaces layout) + built artifacts.
# next.config.ts is required: `next start` loads it on boot.
COPY --from=deps /app/node_modules ./node_modules
COPY package.json package-lock.json ./
COPY bold-template-pack ./bold-template-pack
COPY packages/core/package.json ./packages/core/
COPY packages/core/dist ./packages/core/dist
COPY apps/web/package.json ./apps/web/
COPY apps/web/next.config.ts ./apps/web/
COPY apps/web/public ./apps/web/public
COPY apps/web/.next ./apps/web/.next
RUN npm prune --omit=dev --no-audit --no-fund \
  && useradd -m nextjs \
  && chown -R nextjs:nextjs /app
USER nextjs
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
  CMD node -e "fetch('http://localhost:'+(process.env.PORT||'3000')+'/api/catalog').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"
CMD ["sh", "-c", "npm run start --workspace=@typodeck/web -- --port ${PORT:-3000}"]
