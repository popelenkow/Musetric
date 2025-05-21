import { z } from 'zod/v4';

export const itemSchema = z.object({
  data: z.instanceof(Uint8Array),
  filename: z.string(),
  contentType: z.string(),
});
export type Item = z.infer<typeof itemSchema>;

export namespace upload {
  export const route = '/preview/project/:projectId';
  export const paramsSchema = z.object({ projectId: z.coerce.number() });
  export const requestSchema = itemSchema;
  export type Request = z.infer<typeof requestSchema>;
  export const responseSchema = z.object({ id: z.number() });
  export type Response = z.infer<typeof responseSchema>;
}
