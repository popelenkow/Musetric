import { z } from 'zod/v4';
import { fastifyRoute, createApiRoute } from './common';
import { axiosRequest } from './common/axiosRequest';

export const itemSchema = z.file({});
export type Item = z.infer<typeof itemSchema>;

export namespace get {
  export const base = createApiRoute({
    method: 'get',
    path: '/api/preview/:previewId',
    paramsSchema: z.object({ previewId: z.number() }),
    requestSchema: z.void(),
    responseSchema: z.instanceof(Uint8Array<ArrayBufferLike>),
  });
  export const url = (previewId?: number) =>
    previewId !== undefined ? base.endpoint({ previewId }) : undefined;
  export const route = fastifyRoute(base);
  export const request = axiosRequest(base);
  export type Params = z.infer<typeof base.paramsSchema>;
  export type Request = z.infer<typeof base.requestSchema>;
  export type Response = z.infer<typeof base.responseSchema>;
}
