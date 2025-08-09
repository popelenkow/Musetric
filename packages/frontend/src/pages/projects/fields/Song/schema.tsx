import { z } from 'zod';

export const songValueSchema = () =>
  z.object({
    file: z.file(),
    url: z.url(),
  });
export type SongValue = z.infer<ReturnType<typeof songValueSchema>>;
