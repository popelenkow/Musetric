import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

export const rootPath = join(
  dirname(fileURLToPath(import.meta.url)),
  '../../../',
);
const venvDir = join(rootPath, '.venv');
export const pythonPath =
  process.platform === 'win32'
    ? join(venvDir, 'Scripts', 'python.exe')
    : join(venvDir, 'bin', 'python');
