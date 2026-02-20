import { z } from 'zod';
import { createApiRoute } from '../common/apiRoute.js';

export const typeSchema = z.enum(['lead', 'backing', 'instrumental']);
export type Type = z.infer<typeof typeSchema>;

export namespace get {
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
  export type Params = z.infer<typeof base.paramsSchema>;
  export type Request = z.infer<typeof base.requestSchema>;
  export type Response = z.infer<typeof base.responseSchema>;
}
