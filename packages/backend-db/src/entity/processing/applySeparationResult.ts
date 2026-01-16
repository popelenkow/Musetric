import type { DatabaseSync } from 'node:sqlite';
import type { BlobFile } from '@musetric/resource-utils/blobStorage';
import { transaction } from '../../common/index.js';

export type ApplySeparationResultArg = {
  projectId: number;
  vocal: BlobFile;
  instrumental: BlobFile;
};

export const applySeparationResult = (database: DatabaseSync) => {
  const insertSoundStatement = database.prepare(
    `INSERT INTO Sound (projectId, type, blobId, filename, contentType) VALUES (?, ?, ?, ?, ?)`,
  );

  return async (arg: ApplySeparationResultArg): Promise<void> => {
    return await transaction(database, async () => {
      await Promise.resolve(
        insertSoundStatement.run(
          arg.projectId,
          'vocal',
          arg.vocal.blobId,
          arg.vocal.filename,
          arg.vocal.contentType,
        ),
      );

      await Promise.resolve(
        insertSoundStatement.run(
          arg.projectId,
          'instrumental',
          arg.instrumental.blobId,
          arg.instrumental.filename,
          arg.instrumental.contentType,
        ),
      );
    });
  };
};
