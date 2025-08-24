# Architecture Overview

Musetric is a TypeScript monorepo with the following structure:

- **Yarn workspaces** - All TypeScript/JavaScript packages are managed through Yarn workspaces from the root directory. Dependencies, scripts, and builds are coordinated centrally with shared configurations and cross-package references.
- **UV package manager** - Python components use UV for fast dependency resolution and virtual environment management. Each Python package has its own pyproject.toml file for local dependency management and isolated environments.

## Projects

- **frontend** - Target frontend application that implements all business requirements with audio visualization and real-time spectrogram rendering
- **backend** - Target backend service that implements business logic for frontend requirements with database, file storage, and API endpoints
- **backend-workers** - Python-based workers for audio separation and processing, used by backend
- **audio-view** - Core audio visualization library with GPU-accelerated FFT and spectrogram rendering, used by frontend
- **audio-in-out** - Audio input/output handling and processing utilities, used by frontend
- **api** - Shared API definitions and route schemas, used by frontend and backend
- **spa-router** - Custom single-page application router, used by frontend
- **resource-utils** - Helper functions for managing heavy application resources, used across multiple packages
- **eslint-config** - Shared ESLint configuration, used by all TypeScript packages
- **performance** - Performance benchmarking tools

## Technology Stack

- **Frontend**: React, Material-UI, Vite, Zustand (state), TanStack React Query, i18next
- **Backend**: Fastify, Prisma, SQLite, TypeScript
- **Frontend Audio Processing**: WebGPU shaders (WGSL), FFT algorithms
- **Backend Audio Processing**: Python workers with PyTorch neural networks, ONNX runtime GPU acceleration, audio-separator library
- **Code Quality**: TypeScript type checking, ESLint linting, Prettier formatting, dependency constraints, Python Black formatting, Python isort imports, Python Ruff linting
- **Testing**: Vitest for JavaScript/TypeScript packages, Playwright for browser testing
