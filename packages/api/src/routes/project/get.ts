import { z } from 'zod';
import { createApiRoute } from '../common/index.js';
import { itemSchema } from './common.js';

export const base = createApiRoute({
  method: 'get',
  path: '/api/project/:projectId',
  paramsSchema: z.object({ projectId: z.number() }),
  requestSchema: z.void(),
  responseSchema: itemSchema,
});

export type Params = z.infer<typeof base.paramsSchema>;
export type Request = z.infer<typeof base.requestSchema>;
export type Response = z.infer<typeof base.responseSchema>;
