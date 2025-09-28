import type { DatabaseSync } from 'node:sqlite';
import { create } from './create';
import { get } from './get';
import { list } from './list';
import { remove } from './remove';
import { update } from './update';

export const createInstance = (database: DatabaseSync) => ({
  list: list(database),
  get: get(database),
  create: create(database),
  update: update(database),
  remove: remove(database),
});
