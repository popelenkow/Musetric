import type { DatabaseSync } from 'node:sqlite';
import { table } from '../../schema/index.js';

export const pendingValidation = (database: DatabaseSync) => {
  const statement = database.prepare(
    `SELECT * FROM Sound WHERE type = 'rawSource'`,
  );

  return async (): Promise<table.sound.Item | undefined> => {
    const row = await Promise.resolve(statement.get());
    if (!row) {
      return undefined;
    }
    return table.sound.itemSchema.parse(row);
  };
};
