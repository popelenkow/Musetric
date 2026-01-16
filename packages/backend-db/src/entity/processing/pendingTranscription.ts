import type { DatabaseSync } from 'node:sqlite';
import { table } from '../../schema/index.js';

export const pendingTranscription = (database: DatabaseSync) => {
  const statement = database.prepare(
    `SELECT Sound.*
     FROM Sound
     LEFT JOIN Subtitle ON Subtitle.projectId = Sound.projectId
     WHERE Sound.type = 'vocal' AND Subtitle.id IS NULL
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
