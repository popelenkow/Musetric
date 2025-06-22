import { z } from 'zod/v4';
import { fastifyRoute, createApiRoute } from './common';
import { axiosRequest } from './common/axiosRequest';
import { preview } from '.';

export const itemSchema = z.object({
  id: z.number(),
  name: z.string().min(3),
  stage: z.enum(['init', 'pending', 'progress', 'done']),
  previewUrl: z.string().optional(),
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
    paramsSchema: z.object({ projectId: z.number() }),
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
      song: z.file(),
      name: itemSchema.shape.name,
      preview: preview.itemSchema.optional(),
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

export namespace edit {
  export const base = createApiRoute({
    method: 'patch',
    path: '/api/project/:projectId/edit',
    paramsSchema: z.object({ projectId: z.number() }),
    requestSchema: z
      .object({
        name: itemSchema.shape.name,
        preview: preview.itemSchema,
        withoutPreview: z.boolean(),
      })
      .partial(),
    responseSchema: itemSchema,
    isMultipart: true,
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
    paramsSchema: z.object({ projectId: z.number() }),
    requestSchema: z.void(),
    responseSchema: z.void(),
  });
  export const route = fastifyRoute(base);
  export const request = axiosRequest(base);
  export type Params = z.infer<typeof base.paramsSchema>;
  export type Request = z.infer<typeof base.requestSchema>;
  export type Response = z.infer<typeof base.responseSchema>;
}
