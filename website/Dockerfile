# Build context is the repo root (the website depends on workspace packages).
FROM node:20-alpine AS builder
RUN corepack enable
WORKDIR /app
COPY . .
RUN pnpm install --frozen-lockfile --filter @tomato-form/website...

# Rewrites and NEXT_PUBLIC_* are baked in at build time.
ARG SERVER_API_URL
ARG STORAGE_API_URL
ARG COPILOT_API_URL
ARG NEXT_PUBLIC_SOCKET_URL
ARG NEXT_PUBLIC_YJS_URL
RUN pnpm --filter @tomato-form/website... build

FROM node:20-alpine
WORKDIR /app
ENV NODE_ENV=production PORT=3021 HOSTNAME=0.0.0.0
COPY --from=builder /app/website/.next/standalone ./
COPY --from=builder /app/website/.next/static ./website/.next/static
EXPOSE 3021
CMD ["node", "website/server.js"]
