import { z } from 'zod';
import { createApiRoute } from '../common/apiRoute.js';

export const wordSchema = z.object({
  text: z.string(),
  start: z.number(),
  end: z.number(),
});

export const segmentSchema = z.object({
  text: z.string(),
  start: z.number(),
  end: z.number(),
  words: z.array(wordSchema),
});
export type Word = z.infer<typeof wordSchema>;
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
  export type Params = z.infer<typeof base.paramsSchema>;
  export type Request = z.infer<typeof base.requestSchema>;
  export type Response = z.infer<typeof base.responseSchema>;
}
