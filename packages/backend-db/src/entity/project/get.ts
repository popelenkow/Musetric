import type { DatabaseSync } from 'node:sqlite';
import { z } from 'zod';
import { bucketizeRow, hasValue } from '../../common';
import { table } from '../../schema';

const getItemSchema = table.project.itemSchema.extend({
  preview: table.preview.itemSchema.optional(),
});
export type GetItem = z.infer<typeof getItemSchema>;

export const get = (database: DatabaseSync) => {
  const statement = database.prepare(`
    SELECT
      Project.id AS project_id,
      Project.name AS project_name,
      Project.stage AS project_stage,
      Preview.id AS preview_id,
      Preview.projectId AS preview_projectId,
      Preview.blobId AS preview_blobId,
      Preview.filename AS preview_filename,
      Preview.contentType AS preview_contentType
    FROM Project
    LEFT JOIN Preview ON Preview.projectId = Project.id
    WHERE Project.id = ?
  `);

  return (projectId: number): GetItem | undefined => {
    const row = statement.get(projectId);
    if (!row) {
      return undefined;
    }
    const buckets = bucketizeRow(row);
    return getItemSchema.parse({
      ...buckets.project,
      preview: hasValue(buckets.preview?.id) ? buckets.preview : undefined,
    });
  };
};
