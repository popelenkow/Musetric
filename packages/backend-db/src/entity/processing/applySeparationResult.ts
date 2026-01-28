import type { DatabaseSync } from 'node:sqlite';
import { transaction } from '../../common/index.js';

export type ApplySeparationResultArg = {
  projectId: number;
  leadId: string;
  backingId: string;
  instrumentalId: string;
};

export const applySeparationResult = (database: DatabaseSync) => {
  const insertAudioStatement = database.prepare(
    `INSERT INTO AudioMaster (projectId, type, blobId) VALUES (?, ?, ?)`,
  );

  return async (arg: ApplySeparationResultArg): Promise<void> => {
    return await transaction(database, async () => {
      await Promise.resolve(
        insertAudioStatement.run(arg.projectId, 'lead', arg.leadId),
      );

      await Promise.resolve(
        insertAudioStatement.run(
          arg.projectId,
          'instrumental',
          arg.instrumentalId,
        ),
      );

      await Promise.resolve(
        insertAudioStatement.run(arg.projectId, 'backing', arg.backingId),
      );
    });
  };
};
