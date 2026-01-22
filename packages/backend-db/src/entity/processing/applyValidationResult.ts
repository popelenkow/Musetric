import type { DatabaseSync } from 'node:sqlite';
import { transaction } from '../../common/index.js';

export type ApplyValidationResultArg = {
  projectId: number;
  sourceId: string;
  rawSourceId: string;
};

export const applyValidationResult = (database: DatabaseSync) => {
  const insertSoundStatement = database.prepare(
    `INSERT INTO Sound (projectId, type, blobId) VALUES (?, 'source', ?)`,
  );
  const deleteSoundStatement = database.prepare(
    `DELETE FROM Sound WHERE projectId = ? AND type = 'rawSource' AND blobId = ?`,
  );

  return async (arg: ApplyValidationResultArg): Promise<void> => {
    return await transaction(database, async () => {
      await Promise.resolve(
        insertSoundStatement.run(arg.projectId, arg.sourceId),
      );
      await Promise.resolve(
        deleteSoundStatement.run(arg.projectId, arg.rawSourceId),
      );
    });
  };
};
