import type { DatabaseSync } from 'node:sqlite';
import { table } from '../../schema/index.js';

export const pendingValidation = (database: DatabaseSync) => {
  const statement = database.prepare(
    `SELECT * FROM AudioMaster WHERE type = 'rawSource'`,
  );

  return async (): Promise<table.audioMaster.Item | undefined> => {
    const row = await Promise.resolve(statement.get());
    if (!row) {
      return undefined;
    }
    return table.audioMaster.itemSchema.parse(row);
  };
};
