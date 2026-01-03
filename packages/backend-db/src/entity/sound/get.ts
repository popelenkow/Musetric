import type { DatabaseSync } from 'node:sqlite';
import { table } from '../../schema/index.js';

export type SoundType = table.sound.Type;
export type GetItem = table.sound.Item;

export const get = (database: DatabaseSync) => {
  const statement = database.prepare(
    `SELECT id, projectId, type, blobId, filename, contentType FROM Sound WHERE projectId = ? AND type = ?`,
  );

  return async (
    projectId: number,
    type: SoundType,
  ): Promise<GetItem | undefined> => {
    const row = await Promise.resolve(statement.get(projectId, type));
    if (!row) {
      return undefined;
    }
    return table.sound.itemSchema.parse(row);
  };
};
