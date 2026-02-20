import { z } from 'zod';

export const typeSchema = z.enum(['source', 'lead', 'backing', 'instrumental']);
export type Type = z.infer<typeof typeSchema>;
