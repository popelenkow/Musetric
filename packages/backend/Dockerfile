FROM node:24.7.0-slim AS base
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    python3 \
    python3-pip \
    ffmpeg \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Install uv (Python package manager)
RUN curl -LsSf https://astral.sh/uv/install.sh | sh
ENV PATH="/root/.local/bin:$PATH"

RUN corepack enable
RUN corepack prepare yarn@4.9.1 --activate

COPY . .
RUN find /app -maxdepth 3 | sed 's|/app/||g'
 
RUN yarn workspaces focus @musetric/backend

# Install Python dependencies for backend-workers
WORKDIR /app/packages/backend-workers
RUN uv sync

WORKDIR /app/packages/backend
ENV PROTOCOL=http
ENV PORT=80
ENV BLOB_STORAGE_PATH=/app/blobs
EXPOSE 80

# Create blob storage directory
RUN mkdir -p /app/blobs

CMD ["yarn", "dev"]
