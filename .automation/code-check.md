# Code Check Workflow

**After writing code, run all checks in the specified order.**

```bash
yarn check:deps:fix          # Dependencies and constraints
yarn check:ts                # TypeScript type checking
yarn check:lint:fix          # ESLint issues
yarn check:translations:fix  # Translation issues
yarn check:format:fix        # Prettier formatting
yarn test                    # Run tests
```
