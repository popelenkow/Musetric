# Playwright MCP Setup

For anyone with Playwright MCP access to run services, browse the site, and test functionality.

## Quick Start

```bash
yarn      # Install dependencies
yarn dev  # Start all services
```

## Services

| Service     | URL                         | Process Name           |
| ----------- | --------------------------- | ---------------------- |
| Backend API | https://localhost:3000/     | `musetric-backend`     |
| API Docs    | https://localhost:3000/docs | `musetric-backend`     |
| Frontend    | https://localhost:3001/     | `musetric-frontend`    |
| Performance | https://localhost:3002/     | `musetric-performance` |

## Troubleshooting

**Port conflicts?** Stop processes and restart:

```bash
yarn dev:stop  # Kill all processes
yarn dev       # Start again
```
