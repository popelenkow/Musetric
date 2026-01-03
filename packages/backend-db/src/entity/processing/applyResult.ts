import type { DatabaseSync } from 'node:sqlite';
import type { BlobFile } from '@musetric/resource-utils/blobStorage';
import { transaction } from '../../common/index.js';

export type ApplyResultArg = {
  projectId: number;
  vocal: BlobFile;
  instrumental: BlobFile;
  transcriptionBlobId: string;
};

export const applyResult = (database: DatabaseSync) => {
  const insertSoundStatement = database.prepare(
    `INSERT INTO Sound (projectId, type, blobId, filename, contentType) VALUES (?, ?, ?, ?, ?)`,
  );
  const insertSubtitleStatement = database.prepare(
    `INSERT INTO Subtitle (projectId, blobId)
     VALUES (?, ?)
     ON CONFLICT(projectId) DO UPDATE SET blobId = excluded.blobId`,
  );
  const updateProjectStageStatement = database.prepare(
    `UPDATE Project SET stage = ? WHERE id = ?`,
  );

  return async (arg: ApplyResultArg): Promise<void> => {
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

      await Promise.resolve(
        insertSubtitleStatement.run(arg.projectId, arg.transcriptionBlobId),
      );

      await Promise.resolve(
        updateProjectStageStatement.run('done', arg.projectId),
      );
    });
  };
};
