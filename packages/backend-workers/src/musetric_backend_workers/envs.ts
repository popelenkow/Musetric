import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const currentDir = dirname(fileURLToPath(import.meta.url));

export const envs = {
  rootPath: join(currentDir, '..', '..'),
  separateScriptPath: join(currentDir, 'separate', 'index.py'),
};
