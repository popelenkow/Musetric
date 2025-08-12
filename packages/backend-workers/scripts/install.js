#!/usr/bin/env node
import { execSync } from 'child_process';

const isCheck = process.env.CI_CHECK === 'true';
const command = isCheck
  ? 'uv sync --group dev --no-install-project'
  : 'uv sync --group dev';

try {
  execSync(command, { stdio: 'inherit' });
} catch (error) {
  process.exit(1);
}
