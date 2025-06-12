import { z } from 'zod/v4';

export const previewValueSchema = () =>
  z.object({
    file: z.file().optional(),
    url: z.url().optional(),
  });
export type PreviewValue = z.infer<ReturnType<typeof previewValueSchema>>;
