import type { DatabaseSync } from 'node:sqlite';
import { table } from '../../schema/index.js';

export type GetItem = table.preview.Item;

export const get = (database: DatabaseSync) => {
  const statement = database.prepare(
    `SELECT id, projectId, blobId, filename, contentType FROM Preview WHERE id = ?`,
  );

  return (previewId: number): GetItem | undefined => {
    const row = statement.get(previewId);
    if (!row) {
      return undefined;
    }
    return table.preview.itemSchema.parse(row);
  };
};
