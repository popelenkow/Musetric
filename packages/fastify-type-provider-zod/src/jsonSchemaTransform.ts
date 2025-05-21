import { FastifySchema } from 'fastify';
import { z } from 'zod/v4';

const mapSchema = (schema: z.ZodAny) =>
  schema ? z.toJSONSchema(schema) : undefined;
const mapSchemas = (object: unknown) => {
  if (!object) {
    return undefined;
  }
  return Object.fromEntries(
    Object.entries(object).map(([key, value]) => [key, mapSchema(value)]),
  );
};

export type JsonSchemaTransformOptions = {
  schema: FastifySchema;
  url: string;
};
export const jsonSchemaTransform = (options: JsonSchemaTransformOptions) => {
  const { url } = options;

  const { response, headers, querystring, body, params, ...rest } =
    options.schema;

  const schema: FastifySchema = {
    ...rest,
    ...mapSchemas({ headers, querystring, body, params }),
    response: mapSchemas(response),
  };

  return { schema, url };
};
