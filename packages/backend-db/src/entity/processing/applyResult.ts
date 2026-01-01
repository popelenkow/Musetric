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

  return (arg: ApplyResultArg): void => {
    transaction(database, () => {
      insertSoundStatement.run(
        arg.projectId,
        'vocal',
        arg.vocal.blobId,
        arg.vocal.filename,
        arg.vocal.contentType,
      );

      insertSoundStatement.run(
        arg.projectId,
        'instrumental',
        arg.instrumental.blobId,
        arg.instrumental.filename,
        arg.instrumental.contentType,
      );

      insertSubtitleStatement.run(arg.projectId, arg.transcriptionBlobId);

      updateProjectStageStatement.run('done', arg.projectId);
    });
  };
};
