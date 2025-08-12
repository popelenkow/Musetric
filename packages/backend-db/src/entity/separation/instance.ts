import type { DatabaseSync } from 'node:sqlite';
import { applyResult } from './applyResult';
import { pendingOriginal } from './pendingOriginal';

export const createInstance = (database: DatabaseSync) => ({
  pendingOriginal: pendingOriginal(database),
  applyResult: applyResult(database),
});
