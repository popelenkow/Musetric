import { z } from 'zod';
import { axiosRequest } from '../common/axiosRequest.js';
import { createApiRoute, fastifyRoute } from '../common/index.js';
import { typeSchema } from './common.js';

export const base = createApiRoute({
  method: 'get',
  path: '/api/audioDelivery/project/:projectId/:type',
  paramsSchema: z.object({
    projectId: z.number(),
    type: typeSchema,
  }),
  requestSchema: z.void(),
  responseSchema: z.instanceof(Uint8Array<ArrayBuffer>),
});

export const route = fastifyRoute(base);
export const request = axiosRequest(base);
export type Params = z.infer<typeof base.paramsSchema>;
export type Request = z.infer<typeof base.requestSchema>;
export type Response = z.infer<typeof base.responseSchema>;
