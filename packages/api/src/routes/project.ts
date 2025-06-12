import { z } from 'zod/v4';
import { fastifyRoute, createApiRoute } from './common';
import { axiosRequest } from './common/axiosRequest';

export const itemSchema = z.object({
  id: z.number(),
  name: z.string(),
  stage: z.enum(['init', 'pending', 'progress', 'done']),
  previewId: z.number().optional(),
});
export type Item = z.infer<typeof itemSchema>;

export namespace list {
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
}

export namespace get {
  export const base = createApiRoute({
    method: 'get',
    path: '/api/project/:projectId',
    paramsSchema: z.object({ projectId: z.coerce.number() }),
    requestSchema: z.void(),
    responseSchema: itemSchema,
  });
  export const route = fastifyRoute(base);
  export const request = axiosRequest(base);
  export type Params = z.infer<typeof base.paramsSchema>;
  export type Request = z.infer<typeof base.requestSchema>;
  export type Response = z.infer<typeof base.responseSchema>;
}

export namespace create {
  export const base = createApiRoute({
    method: 'post',
    path: '/api/project/create',
    paramsSchema: z.void(),
    requestSchema: z.object({
      file: z.file(),
    }),
    responseSchema: itemSchema,
    isMultipart: true,
  });
  export const route = fastifyRoute(base);
  export const request = axiosRequest(base);
  export type Params = z.infer<typeof base.paramsSchema>;
  export type Request = z.infer<typeof base.requestSchema>;
  export type Response = z.infer<typeof base.responseSchema>;
}

export namespace rename {
  export const base = createApiRoute({
    method: 'post',
    path: '/api/project/:projectId/rename',
    paramsSchema: z.object({ projectId: z.coerce.number() }),
    requestSchema: itemSchema.pick({ name: true }),
    responseSchema: itemSchema,
  });
  export const route = fastifyRoute(base);
  export const request = axiosRequest(base);
  export type Params = z.infer<typeof base.paramsSchema>;
  export type Request = z.infer<typeof base.requestSchema>;
  export type Response = z.infer<typeof base.responseSchema>;
}

export namespace remove {
  export const base = createApiRoute({
    method: 'delete',
    path: '/api/project/:projectId/remove',
    paramsSchema: z.object({ projectId: z.coerce.number() }),
    requestSchema: z.void(),
    responseSchema: z.void(),
  });
  export const route = fastifyRoute(base);
  export const request = axiosRequest(base);
  export type Params = z.infer<typeof base.paramsSchema>;
  export type Request = z.infer<typeof base.requestSchema>;
  export type Response = z.infer<typeof base.responseSchema>;
}
