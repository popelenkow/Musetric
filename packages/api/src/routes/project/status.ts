import { z } from 'zod';
import { createApiEvent } from '../common/apiEvent.js';
import { createApiRoute, fastifyRoute } from '../common/index.js';
import { processingSchema } from './common.js';

export const base = createApiRoute({
  method: 'get',
  path: '/api/project/status/stream',
  paramsSchema: z.void(),
  requestSchema: z.void(),
  responseSchema: z
    .string()
    .describe(
      'Server-Sent Events stream (text/event-stream) with JSON encoded project status updates and heartbeat events.',
    ),
});

export const route = fastifyRoute(base);
export type Params = z.infer<typeof base.paramsSchema>;
export type Request = z.infer<typeof base.requestSchema>;
export type Response = z.infer<typeof base.responseSchema>;

export const event = createApiEvent({
  path: '/api/project/status/stream',
  schema: z.object({
    projectId: z.number(),
    processing: processingSchema,
  }),
});
export type Event = z.infer<typeof event.schema>;
