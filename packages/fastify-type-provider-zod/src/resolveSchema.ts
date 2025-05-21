import z from 'zod/v4';
import { InvalidSchemaError } from './errors';

export const resolveSchema = (
  maybeSchema: z.ZodTypeAny | { properties: z.ZodTypeAny },
): z.ZodTypeAny => {
  if ('safeParse' in maybeSchema) {
    return maybeSchema;
  }
  if ('properties' in maybeSchema) {
    return maybeSchema.properties;
  }
  throw new InvalidSchemaError(JSON.stringify(maybeSchema));
};
