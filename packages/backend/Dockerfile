FROM node:24.7.0-slim AS base
WORKDIR /app

RUN corepack enable
RUN corepack prepare yarn@4.9.3 --activate

COPY . .
RUN find /app -maxdepth 3 | sed 's|/app/||g'
 
RUN yarn workspaces focus @musetric/backend

WORKDIR /app/packages/backend
ENV PROTOCOL=http
ENV PORT=80
EXPOSE 80

CMD ["yarn", "dev"]
