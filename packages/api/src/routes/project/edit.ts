import { z } from 'zod';
import { createApiRoute } from '../common/index.js';
import * as preview from '../preview/common.js';
import { itemSchema } from './common.js';

export const base = createApiRoute({
  method: 'patch',
  path: '/api/project/:projectId/edit',
  paramsSchema: z.object({ projectId: z.number() }),
  requestSchema: z
    .object({
      name: itemSchema.shape.name,
      preview: preview.itemSchema,
      withoutPreview: z.boolean(),
    })
    .partial(),
  responseSchema: itemSchema,
  isMultipart: true,
});

export type Params = z.infer<typeof base.paramsSchema>;
export type Request = z.infer<typeof base.requestSchema>;
export type Response = z.infer<typeof base.responseSchema>;
