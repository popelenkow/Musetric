# Automated Testing Setup

**This guide is exclusively for Claude Code automated browser testing via Playwright MCP. Other tools cannot use this way.**

## Setup & Start

```bash
yarn      # Install dependencies
yarn dev  # Start all services (run in monorepo root only)
```

## Running Services

The `yarn dev` command starts these services:

- **Backend API**: https://localhost:3000/ (REST API)
- **API Documentation**: https://localhost:3000/docs (Swagger docs)
- **Frontend**: https://localhost:3001/ (main application)
- **Performance Testing**: https://localhost:3002/ (performance benchmarks)

## Resource Management

**If ports are occupied, Node.js processes are still running and must be terminated before starting development services.**

Signs requiring process cleanup:

- Port already in use errors
- Services not accessible on expected URLs
- Wrong port bindings

**Solution**: Kill all Node.js processes and restart `yarn dev`.
