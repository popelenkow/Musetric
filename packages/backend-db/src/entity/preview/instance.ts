import type { DatabaseSync } from 'node:sqlite';
import { get } from './get';

export const createInstance = (database: DatabaseSync) => ({
  get: get(database),
});
