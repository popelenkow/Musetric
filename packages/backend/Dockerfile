FROM musetric-runtime:latest AS builder
ENV workspace_mode=docker
RUN corepack enable
RUN corepack prepare yarn@4.9.3 --activate
COPY . .
RUN yarn install --immutable
RUN yarn project:build
RUN yarn project:init
RUN rm -rf node_modules
RUN yarn workspaces focus @musetric/backend --production

FROM musetric-runtime:latest AS runner
ENV workspace_mode=build
ENV PROTOCOL=http
ENV PORT=80

COPY --from=builder /app/node_modules ./node_modules

COPY --from=builder /app/packages/backend/package.json ./packages/backend/package.json
COPY --from=builder /app/packages/backend/dist ./packages/backend/dist
COPY --from=builder /app/packages/backend/storage ./packages/backend/storage

COPY --from=builder /app/packages/backend-db/package.json ./packages/backend-db/package.json
COPY --from=builder /app/packages/backend-db/dist ./packages/backend-db/dist

COPY --from=builder /app/packages/backend-workers/package.json ./packages/backend-workers/package.json
COPY --from=builder /app/packages/backend-workers/dist ./packages/backend-workers/dist
COPY --from=builder /app/packages/backend-workers/musetricBackendWorkers ./packages/backend-workers/musetricBackendWorkers
COPY --from=builder /app/packages/backend-workers/scripts ./packages/backend-workers/scripts
COPY --from=builder /app/packages/backend-workers/pyproject.toml ./packages/backend-workers/pyproject.toml
COPY --from=builder /app/packages/backend-workers/uv.lock ./packages/backend-workers/uv.lock

COPY --from=builder /app/packages/api/package.json ./packages/api/package.json
COPY --from=builder /app/packages/api/dist ./packages/api/dist

COPY --from=builder /app/packages/resource-utils/package.json ./packages/resource-utils/package.json
COPY --from=builder /app/packages/resource-utils/dist ./packages/resource-utils/dist

WORKDIR /app/packages/backend-workers
RUN node --conditions=monorepo ./scripts/install.ts

WORKDIR /app/packages/backend
EXPOSE 80

CMD ["node", "./dist/index.js"]
