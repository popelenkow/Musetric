import type { DatabaseSync } from 'node:sqlite';
import { table } from '../../schema/index.js';

export type GetItem = table.subtitle.Item;

export const getByProject = (database: DatabaseSync) => {
  const statement = database.prepare(
    `SELECT id, projectId, blobId FROM Subtitle WHERE projectId = ?`,
  );

  return async (projectId: number): Promise<GetItem | undefined> => {
    const row = await Promise.resolve(statement.get(projectId));
    if (!row) {
      return undefined;
    }
    return table.subtitle.itemSchema.parse(row);
  };
};
