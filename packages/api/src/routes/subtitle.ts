import { z } from 'zod';
import { axiosRequest } from './common/axiosRequest.js';
import { fastifyRoute, createApiRoute } from './common/index.js';

export const wordSchema = z.object({
  text: z.string(),
  start: z.number(),
  end: z.number(),
});

export const segmentSchema = z.object({
  text: z.string(),
  start: z.number(),
  end: z.number(),
  words: z.array(wordSchema).optional(),
});
export type Segment = z.infer<typeof segmentSchema>;

export namespace get {
  export const base = createApiRoute({
    method: 'get',
    path: '/api/subtitle/project/:projectId',
    paramsSchema: z.object({
      projectId: z.number(),
    }),
    requestSchema: z.void(),
    responseSchema: z.array(segmentSchema),
  });
  export const route = fastifyRoute(base);
  export const request = axiosRequest(base);
  export type Params = z.infer<typeof base.paramsSchema>;
  export type Request = z.infer<typeof base.requestSchema>;
  export type Response = z.infer<typeof base.responseSchema>;
}
