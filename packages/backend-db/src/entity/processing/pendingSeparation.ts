import type { DatabaseSync } from 'node:sqlite';
import { table } from '../../schema/index.js';

export const pendingSeparation = (database: DatabaseSync) => {
  const statement = database.prepare(
    `SELECT Sound.*
     FROM Sound
     WHERE Sound.type = 'original'
       AND NOT EXISTS (
         SELECT 1 FROM Sound AS Lead
         WHERE Lead.projectId = Sound.projectId AND Lead.type = 'lead'
       )
     `,
  );

  return async (): Promise<table.sound.Item | undefined> => {
    const row = await Promise.resolve(statement.get());
    if (!row) {
      return undefined;
    }
    return table.sound.itemSchema.parse(row);
  };
};
