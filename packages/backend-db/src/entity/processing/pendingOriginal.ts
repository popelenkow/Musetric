import type { DatabaseSync } from 'node:sqlite';
import { z } from 'zod';
import { table } from '../../schema/index.js';

const pendingOriginalItemSchema = z.object({
  projectId: table.sound.itemSchema.shape.projectId,
  blobId: table.sound.itemSchema.shape.blobId,
  filename: table.sound.itemSchema.shape.filename,
});
export type PendingOriginalItem = z.infer<typeof pendingOriginalItemSchema>;

export const pendingOriginal = (database: DatabaseSync) => {
  const statement = database.prepare(
    `SELECT Sound.projectId AS projectId, Sound.blobId AS blobId, Sound.filename AS filename
     FROM Sound
     INNER JOIN Project ON Project.id = Sound.projectId
     WHERE Sound.type = 'original' AND Project.stage = 'pending'
     ORDER BY Sound.projectId ASC
     LIMIT 1`,
  );

  return async (): Promise<PendingOriginalItem | undefined> => {
    const row = await Promise.resolve(statement.get());
    if (!row) {
      return undefined;
    }
    return pendingOriginalItemSchema.parse(row);
  };
};
