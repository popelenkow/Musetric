import { z } from 'zod/v4';
import { endpointify } from './common';

export const itemSchema = z.object({
  id: z.number(),
  name: z.string(),
  stage: z.enum(['init', 'pending', 'progress', 'done']),
  previewId: z.number().optional(),
});
export type Item = z.infer<typeof itemSchema>;

export namespace list {
  export const route = '/api/project/list';
  export const endpoint = () => route;
  export const responseSchema = z.array(itemSchema);
  export type Response = z.infer<typeof responseSchema>;
}

export namespace get {
  export const route = '/api/project/:projectId';
  export const endpoint = (projectId: number) =>
    endpointify(route, { projectId });
  export const paramsSchema = z.object({ projectId: z.coerce.number() });
  export const responseSchema = itemSchema;
  export type Response = z.infer<typeof responseSchema>;
}

export namespace create {
  export const route = '/api/project';
  export const endpoint = () => route;
  export const requestSchema = itemSchema.pick({ name: true });
  export type Request = z.infer<typeof requestSchema>;
  export const responseSchema = itemSchema;
  export type Response = z.infer<typeof responseSchema>;
}

export namespace rename {
  export const route = '/api/project/:projectId/rename';
  export const endpoint = (projectId: number) =>
    endpointify(route, { projectId });
  export const paramsSchema = z.object({ projectId: z.coerce.number() });
  export const requestSchema = itemSchema.pick({ name: true });
  export type Request = z.infer<typeof requestSchema>;
  export const responseSchema = itemSchema;
  export type Response = z.infer<typeof responseSchema>;
}

export namespace remove {
  export const route = '/api/project/:projectId';
  export const endpoint = (projectId: number) =>
    endpointify(route, { projectId });
  export const paramsSchema = z.object({ projectId: z.coerce.number() });
}
