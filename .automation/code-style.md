# Coding Style Guidelines

Before starting any development work, you MUST read and understand the coding rules defined in:

- [`packages\eslint-config\src\base.ts`](C:\projs\Musetric\packages\eslint-config\src\base.ts) - TypeScript/JavaScript coding standards
- NEVER write comments in code unless explicitly requested
- Frontend styling MUST use Material-UI only - use component props and extend styles via sx prop

### Python Coding Standards

Python code MUST follow PEP 8 standards with the following exception:

- ALL constants must use camelCase (not UPPER_SNAKE_CASE)
- Functions: `get_user_data()`, `process_audio_file()` (snake_case per PEP 8)
- Variables: `user_name`, `audio_buffer`, `max_retries` (snake_case per PEP 8)
- Class names: `AudioProcessor`, `DataValidator` (PascalCase per PEP 8)
- File names: `audio_processor.py`, `data_validator.py` (snake_case per PEP 8)
