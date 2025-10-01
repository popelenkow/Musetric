import type { DatabaseSync } from 'node:sqlite';
import { table } from '../../schema/index.js';

export type SoundType = table.sound.Type;
export type GetItem = table.sound.Item;

export const get = (database: DatabaseSync) => {
  const statement = database.prepare(
    `SELECT id, projectId, type, blobId, filename, contentType FROM Sound WHERE projectId = ? AND type = ?`,
  );

  return (projectId: number, type: SoundType): GetItem | undefined => {
    const row = statement.get(projectId, type);
    if (!row) {
      return undefined;
    }
    return table.sound.itemSchema.parse(row);
  };
};
