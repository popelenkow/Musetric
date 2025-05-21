import { z } from 'zod/v4';

export namespace error {
  export const responseSchema = z.object({
    message: z.string(),
  });
  export type Response = z.infer<typeof responseSchema>;
}

export const endpointify = (
  route: string,
  params: Record<string, string | number>,
) =>
  Object.entries(params).reduce(
    (acc, [key, value]) => acc.replace(`:${key}`, String(value)),
    route,
  );
