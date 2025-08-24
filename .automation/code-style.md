# Coding Style Guidelines

Before starting any development work, you MUST read and understand the coding rules defined in:

- [`packages\eslint-config\src\base.ts`](C:\projs\Musetric\packages\eslint-config\src\base.ts) - TypeScript/JavaScript coding standards
- NEVER write comments in code unless explicitly requested
- Frontend styling MUST use Material-UI only - use component props and extend styles via sx prop

### Python Coding Standards

Python code MUST be syntactically similar to TypeScript wherever possible:

- ALL naming must use camelCase (not snake_case)
- Functions: `getUserData()`, `processAudioFile()`
- Variables: `userName`, `audioBuffer`, `maxRetries`
- Constants: `maxFileSize`, `defaultTimeout` (not UPPER_SNAKE_CASE)
- Class names: `AudioProcessor`, `DataValidator`
- File names: `audioProcessor.py`, `dataValidator.py`
