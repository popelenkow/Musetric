import type { DatabaseSync } from 'node:sqlite';
import { transaction } from '../../common/index.js';

export type ApplyValidationResultArg = {
  projectId: number;
  sourceId: string;
  rawSourceId: string;
};

export const applyValidationResult = (database: DatabaseSync) => {
  const insertAudioStatement = database.prepare(
    `INSERT INTO AudioMaster (projectId, type, blobId) VALUES (?, 'source', ?)`,
  );
  const deleteAudioStatement = database.prepare(
    `DELETE FROM AudioMaster WHERE projectId = ? AND type = 'rawSource' AND blobId = ?`,
  );

  return async (arg: ApplyValidationResultArg): Promise<void> => {
    return await transaction(database, async () => {
      await Promise.resolve(
        insertAudioStatement.run(arg.projectId, arg.sourceId),
      );
      await Promise.resolve(
        deleteAudioStatement.run(arg.projectId, arg.rawSourceId),
      );
    });
  };
};
