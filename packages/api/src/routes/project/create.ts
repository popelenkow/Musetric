import { z } from 'zod';
import { createApiRoute } from '../common/index.js';
import * as preview from '../preview/common.js';
import { itemSchema } from './common.js';

export const base = createApiRoute({
  method: 'post',
  path: '/api/project/create',
  paramsSchema: z.void(),
  requestSchema: z.object({
    song: z.file(),
    name: itemSchema.shape.name,
    preview: preview.itemSchema.optional(),
  }),
  responseSchema: itemSchema,
  isMultipart: true,
});

export type Params = z.infer<typeof base.paramsSchema>;
export type Request = z.infer<typeof base.requestSchema>;
export type Response = z.infer<typeof base.responseSchema>;
