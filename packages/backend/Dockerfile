FROM node:24.7.0-slim AS prod-runtime
WORKDIR /app
ENV NODE_ENV=production

FROM ghcr.io/astral-sh/uv:latest AS uv-runtime

FROM prod-runtime AS dev-runtime
COPY --from=uv-runtime /uv /usr/local/bin/uv
COPY --from=uv-runtime /uvx /usr/local/bin/uvx
RUN corepack enable \
  && corepack prepare yarn@4.9.3 --activate

FROM dev-runtime AS builder
WORKDIR /app
COPY . .
RUN yarn install --immutable
RUN yarn project:build
RUN yarn project:init
RUN rm -rf node_modules
RUN yarn workspaces focus @musetric/backend --production

FROM prod-runtime AS runner
WORKDIR /app
ENV PROTOCOL=http
ENV PORT=80

COPY --from=builder /app/node_modules ./node_modules

COPY --from=builder /app/packages/backend/package.json ./packages/backend/package.json
COPY --from=builder /app/packages/backend/dist ./packages/backend/dist
COPY --from=builder /app/packages/backend/storage ./packages/backend/storage
COPY --from=builder /app/packages/backend/public ./packages/backend/public

COPY --from=builder /app/packages/backend-db/package.json ./packages/backend-db/package.json
COPY --from=builder /app/packages/backend-db/dist ./packages/backend-db/dist

COPY --from=builder /app/packages/api/package.json ./packages/api/package.json
COPY --from=builder /app/packages/api/dist ./packages/api/dist

COPY --from=builder /app/packages/resource-utils/package.json ./packages/resource-utils/package.json
COPY --from=builder /app/packages/resource-utils/dist ./packages/resource-utils/dist

WORKDIR /app/packages/backend
EXPOSE 80

CMD ["node", "./dist/index.js"]

