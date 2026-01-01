import { z } from 'zod';
import { numericIdSchema } from './common.js';

export namespace project {
  export const stageSchema = z.enum(['pending', 'done']);
  export type Stage = z.infer<typeof stageSchema>;

  export const itemSchema = z.object({
    id: numericIdSchema,
    name: z.string(),
    stage: stageSchema,
  });
  export type Item = z.infer<typeof itemSchema>;
}

export namespace sound {
  export const typeSchema = z.enum(['original', 'vocal', 'instrumental']);
  export type Type = z.infer<typeof typeSchema>;

  export const itemSchema = z.object({
    id: numericIdSchema,
    projectId: numericIdSchema,
    type: typeSchema,
    blobId: z.string(),
    filename: z.string(),
    contentType: z.string(),
  });
  export type Item = z.infer<typeof itemSchema>;
}

export namespace preview {
  export const itemSchema = z.object({
    id: numericIdSchema,
    projectId: numericIdSchema,
    blobId: z.string(),
    filename: z.string(),
    contentType: z.string(),
  });
  export type Item = z.infer<typeof itemSchema>;
}

export namespace subtitle {
  export const itemSchema = z.object({
    id: numericIdSchema,
    projectId: numericIdSchema,
    blobId: z.string(),
  });
  export type Item = z.infer<typeof itemSchema>;
}
