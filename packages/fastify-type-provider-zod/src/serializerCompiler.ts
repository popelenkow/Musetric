import { FastifySerializerCompiler } from 'fastify/types/schema';
import z from 'zod/v4';
import { ResponseSerializationError } from './errors';
import { resolveSchema } from './resolveSchema';

export const serializerCompiler: FastifySerializerCompiler<
  z.ZodTypeAny | { properties: z.ZodTypeAny }
> =
  ({ schema, method, url }) =>
  (data) => {
    const result = resolveSchema(schema).safeParse(data);
    if (result.error) {
      throw new ResponseSerializationError(method, url, {
        cause: result.error,
      });
    }

    return JSON.stringify(result.data);
  };
