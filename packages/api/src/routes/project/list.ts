import { z } from 'zod';
import { axiosRequest } from '../common/axiosRequest.js';
import { createApiRoute, fastifyRoute } from '../common/index.js';
import { itemSchema } from './common.js';

export const base = createApiRoute({
  method: 'get',
  path: '/api/project/list',
  paramsSchema: z.void(),
  requestSchema: z.void(),
  responseSchema: z.array(itemSchema),
});

export const route = fastifyRoute(base);
export const request = axiosRequest(base);
export type Params = z.infer<typeof base.paramsSchema>;
export type Request = z.infer<typeof base.requestSchema>;
export type Response = z.infer<typeof base.responseSchema>;
