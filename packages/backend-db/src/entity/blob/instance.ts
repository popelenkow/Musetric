import type { DatabaseSync } from 'node:sqlite';
import { list } from './list';

export const createInstance = (database: DatabaseSync) => ({
  list: list(database),
});
