import { z } from 'zod/v4';
import { fastifyRoute, createApiRoute } from './common';
import { axiosRequest } from './common/axiosRequest';

export const itemSchema = z.file({});
export type Item = z.infer<typeof itemSchema>;

export namespace get {
  export const base = createApiRoute({
    method: 'get',
    path: '/api/preview/:previewId',
    paramsSchema: z.object({ previewId: z.coerce.number() }),
    requestSchema: z.void(),
    responseSchema: z.any(),
  });
  export const route = fastifyRoute(base);
  export const request = axiosRequest(base);
  export type Params = z.infer<typeof base.paramsSchema>;
  export type Request = z.infer<typeof base.requestSchema>;
  export type Response = z.infer<typeof base.responseSchema>;
}

export namespace upload {
  export const base = createApiRoute({
    method: 'post',
    path: '/api/preview/project/:projectId',
    paramsSchema: z.object({ projectId: z.coerce.number() }),
    requestSchema: z.object({
      file: itemSchema,
    }),
    responseSchema: z.object({ id: z.number() }),
  });
  export const route = fastifyRoute(base);
  export const request = axiosRequest(base);
  export type Params = z.infer<typeof base.paramsSchema>;
  export type Request = z.infer<typeof base.requestSchema>;
  export type Response = z.infer<typeof base.responseSchema>;
}
