import type { DatabaseSync } from 'node:sqlite';
import { z } from 'zod';

const blobRowSchema = z.object({
  blobId: z.string(),
});

export const list = (database: DatabaseSync) => {
  const statement = database.prepare(
    'SELECT blobId FROM Sound UNION ALL SELECT blobId FROM Preview',
  );

  return (): string[] => {
    const blobIds: string[] = [];
    const rows = statement.all();
    rows.forEach((row) => {
      const parsed = blobRowSchema.parse(row);
      blobIds.push(parsed.blobId);
    });
    return blobIds;
  };
};
