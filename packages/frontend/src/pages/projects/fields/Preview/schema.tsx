import { z } from 'zod';

export const previewValueSchema = () =>
  z.object({
    file: z.file().optional(),
    url: z.url().optional(),
  });
export type PreviewValue = z.infer<ReturnType<typeof previewValueSchema>>;
