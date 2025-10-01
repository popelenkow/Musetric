import type { DatabaseSync } from 'node:sqlite';
import type { BlobFile } from '@musetric/resource-utils/blobStorage';
import { z } from 'zod';
import { transaction } from '../../common/index.js';
import { numericIdSchema, table } from '../../schema/index.js';

const createItemSchema = z.object({
  project: table.project.itemSchema,
  preview: table.preview.itemSchema.optional(),
});
export type CreateItem = z.infer<typeof createItemSchema>;

export type CreateArg = {
  name: string;
  song: BlobFile;
  preview?: BlobFile;
};

export const create = (database: DatabaseSync) => {
  const insertProjectStatement = database.prepare(
    `INSERT INTO Project (name, stage) VALUES (?, ?)`,
  );
  const insertSoundStatement = database.prepare(
    `INSERT INTO Sound (projectId, type, blobId, filename, contentType) VALUES (?, ?, ?, ?, ?)`,
  );
  const insertPreviewStatement = database.prepare(
    `INSERT INTO Preview (projectId, blobId, filename, contentType) VALUES (?, ?, ?, ?)`,
  );

  return (arg: CreateArg): CreateItem => {
    return transaction(database, () => {
      const projectResult = insertProjectStatement.run(arg.name, 'pending');
      const projectId = numericIdSchema.parse(projectResult.lastInsertRowid);
      const project = table.project.itemSchema.parse({
        id: projectId,
        name: arg.name,
        stage: 'pending',
      });

      insertSoundStatement.run(
        projectId,
        'original',
        arg.song.blobId,
        arg.song.filename,
        arg.song.contentType,
      );

      if (!arg.preview) {
        return createItemSchema.parse({ project, preview: undefined });
      }

      const previewResult = insertPreviewStatement.run(
        projectId,
        arg.preview.blobId,
        arg.preview.filename,
        arg.preview.contentType,
      );
      const previewId = numericIdSchema.parse(previewResult.lastInsertRowid);
      const preview = table.preview.itemSchema.parse({
        id: previewId,
        projectId,
        blobId: arg.preview.blobId,
        filename: arg.preview.filename,
        contentType: arg.preview.contentType,
      });

      return createItemSchema.parse({ project, preview });
    });
  };
};
