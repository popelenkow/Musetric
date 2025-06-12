import { z } from 'zod/v4';
import { fastifyRoute, createApiRoute } from './common';
import { axiosRequest } from './common/axiosRequest';

export const typeSchema = z.enum(['original', 'vocal', 'instrumental']);
export type Type = z.infer<typeof typeSchema>;

export namespace upload {
  export const base = createApiRoute({
    method: 'post',
    path: '/api/sound/project/:projectId/upload',
    paramsSchema: z.object({
      projectId: z.coerce.number(),
    }),
    requestSchema: z.object({
      file: z.file(),
    }),
    responseSchema: z.object({ id: z.number() }),
  });
  export const route = fastifyRoute(base);
  export const request = axiosRequest(base);
  export type Params = z.infer<typeof base.paramsSchema>;
  export type Request = z.infer<typeof base.requestSchema>;
  export type Response = z.infer<typeof base.responseSchema>;
}
