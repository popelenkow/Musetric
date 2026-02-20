import { z } from 'zod';
import { axiosRequest } from '../common/axiosRequest.js';
import { createApiRoute, fastifyRoute } from '../common/index.js';

export const base = createApiRoute({
  method: 'delete',
  path: '/api/project/:projectId/remove',
  paramsSchema: z.object({ projectId: z.number() }),
  requestSchema: z.void(),
  responseSchema: z.void(),
});

export const route = fastifyRoute(base);
export const request = axiosRequest(base);
export type Params = z.infer<typeof base.paramsSchema>;
export type Request = z.infer<typeof base.requestSchema>;
export type Response = z.infer<typeof base.responseSchema>;
