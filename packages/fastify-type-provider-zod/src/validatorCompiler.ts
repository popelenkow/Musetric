import { FastifySchemaCompiler } from 'fastify';
import z from 'zod/v4';
import { createValidationError } from './errors';

export const validatorCompiler: FastifySchemaCompiler<z.ZodTypeAny> =
  ({ schema }) =>
  (data) => {
    const result = schema.safeParse(data);
    if (result.error) {
      // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
      return { error: createValidationError(result.error) as unknown as Error };
    }

    return { value: result.data };
  };
