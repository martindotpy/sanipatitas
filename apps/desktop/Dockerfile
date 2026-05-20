ARG TZ=America/Lima
ARG NODE_ENV=production

FROM oven/bun:1-slim AS builder

ARG TZ
ARG NODE_ENV

ENV TZ=$TZ
ENV NODE_ENV=$NODE_ENV

# Workspace packages
WORKDIR /app

# Assets
COPY assets/ assets/

# Typescript and dependencies
COPY patches/ patches/
COPY package.json bun.lock tsconfig.base.json ./
COPY database/package.json ./database/package.json
COPY services/auth/package.json ./services/auth/package.json
COPY shared/typescript/package.json ./shared/typescript/package.json
COPY shared/ui/package.json ./shared/ui/package.json

RUN bun install --ci

# Shared packages
COPY shared/typescript/tsconfig.json ./shared/typescript/tsconfig.json
COPY shared/typescript/src/ shared/typescript/src/

COPY shared/ui/tailwind.config.js ./shared/ui/tailwind.config.js
COPY shared/ui/tsconfig.json ./shared/ui/tsconfig.json
COPY shared/ui/components.json ./shared/ui/components.json
COPY shared/ui/src/ shared/ui/src/

# Auth service
COPY services/auth/tsconfig.json ./services/auth/tsconfig.json
COPY services/auth/src/ ./services/auth/src/

# App desktop
WORKDIR /app/apps/desktop

# Typescript
COPY apps/desktop/tsconfig.json ./

# Install dependencies
COPY apps/desktop/package.json ./

RUN bun install --ci

# Disable Astro telemetry
RUN bun astro telemetry disable

# Build
COPY apps/desktop/pwa-assets.config.ts ./
COPY apps/desktop/astro.config.ts ./
COPY apps/desktop/public/ public/
COPY apps/desktop/scripts/ scripts/
COPY apps/desktop/src-tauri/icons/ src-tauri/icons/
COPY apps/desktop/src/ src/

RUN bun run build


FROM nginx:1-alpine-slim AS runtime

# Add wget for ready endpoint healthcheck
COPY --from=busybox /lib/* /lib/
COPY --from=busybox /lib64/* /lib64/
COPY --from=busybox /bin/wget /bin/

ARG TZ

ENV TZ=$TZ

# Delete default nginx
RUN apk del -r nginx

RUN apk add --no-cache \
  nginx \
  nginx-mod-http-brotli

COPY apps/desktop/nginx.conf /etc/nginx/nginx.conf
COPY --from=builder /app/apps/desktop/dist/client/ /usr/share/nginx/html/

EXPOSE 80

HEALTHCHECK --interval=120s --timeout=5s --start-period=5s \
  CMD ["/bin/wget", "--spider", "--timeout=5", "http://localhost:80/_health"]
