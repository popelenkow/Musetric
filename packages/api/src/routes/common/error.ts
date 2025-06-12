import { z } from 'zod/v4';

export namespace error {
  export const responseSchema = z.object({
    message: z.string(),
  });
  export type Response = z.infer<typeof responseSchema>;
}
