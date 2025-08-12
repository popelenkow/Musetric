import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

export const rootPath = join(dirname(fileURLToPath(import.meta.url)), '../..');
