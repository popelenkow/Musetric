import z from 'zod';

export const isUint8ArraySchema = (
  schema: unknown,
): schema is z.ZodCustom<Uint8Array> => {
  if (!(schema instanceof z.ZodCustom)) return false;
  const result = schema.def.fn(new Uint8Array());
  return !!result;
};
