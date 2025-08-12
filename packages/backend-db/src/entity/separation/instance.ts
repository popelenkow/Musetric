import type { DatabaseSync } from 'node:sqlite';
import { applyResult } from './applyResult.js';
import { pendingOriginal } from './pendingOriginal.js';

export const createInstance = (database: DatabaseSync) => ({
  pendingOriginal: pendingOriginal(database),
  applyResult: applyResult(database),
});
