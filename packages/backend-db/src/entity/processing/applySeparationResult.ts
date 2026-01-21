import type { DatabaseSync } from 'node:sqlite';
import { transaction } from '../../common/index.js';

export type ApplySeparationResultArg = {
  projectId: number;
  leadId: string;
  backingId: string;
  instrumentalId: string;
};

export const applySeparationResult = (database: DatabaseSync) => {
  const insertSoundStatement = database.prepare(
    `INSERT INTO Sound (projectId, type, blobId) VALUES (?, ?, ?)`,
  );

  return async (arg: ApplySeparationResultArg): Promise<void> => {
    return await transaction(database, async () => {
      await Promise.resolve(
        insertSoundStatement.run(arg.projectId, 'lead', arg.leadId),
      );

      await Promise.resolve(
        insertSoundStatement.run(
          arg.projectId,
          'instrumental',
          arg.instrumentalId,
        ),
      );

      await Promise.resolve(
        insertSoundStatement.run(arg.projectId, 'backing', arg.backingId),
      );
    });
  };
};
