import type { DatabaseSync } from 'node:sqlite';
import { table } from '../../schema/index.js';

export const get = (database: DatabaseSync) => {
  const statement = database.prepare(
    `SELECT id, projectId, type, blobId FROM AudioDelivery WHERE projectId = ? AND type = ?`,
  );

  return async (
    projectId: number,
    type: table.audioDelivery.Type,
  ): Promise<table.audioDelivery.Item | undefined> => {
    const row = await Promise.resolve(statement.get(projectId, type));
    if (!row) {
      return undefined;
    }
    return table.audioDelivery.itemSchema.parse(row);
  };
};
