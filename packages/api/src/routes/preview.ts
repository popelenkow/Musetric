import { z } from 'zod/v4';
import { endpointify } from './common';

export const itemSchema = z.file({});
export type Item = z.infer<typeof itemSchema>;

export namespace get {
  export const route = '/api/preview/:previewId';
  export const endpoint = (previewId: number) =>
    endpointify(route, { previewId });
  export const paramsSchema = z.object({ previewId: z.coerce.number() });
  export const responseSchema = z.object({ id: z.number() });
  export type Response = z.infer<typeof responseSchema>;
}

export namespace upload {
  export const route = '/api/preview/project/:projectId';
  export const endpoint = (projectId: number) =>
    endpointify(route, { projectId });
  export const paramsSchema = z.object({ projectId: z.coerce.number() });
  export const requestSchema = z.object({
    file: itemSchema,
  });
  export type Request = z.infer<typeof requestSchema>;
  export const responseSchema = z.object({ id: z.number() });
  export type Response = z.infer<typeof responseSchema>;
}
