import type { DatabaseSync } from 'node:sqlite';
import type { BlobFile } from '@musetric/resource-utils/blobStorage';
import { transaction } from '../../common/index.js';

export type ApplySeparationResultArg = {
  projectId: number;
  lead: BlobFile;
  backing: BlobFile;
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
          'lead',
          arg.lead.blobId,
          arg.lead.filename,
          arg.lead.contentType,
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

      await Promise.resolve(
        insertSoundStatement.run(
          arg.projectId,
          'backing',
          arg.backing.blobId,
          arg.backing.filename,
          arg.backing.contentType,
        ),
      );
    });
  };
};
