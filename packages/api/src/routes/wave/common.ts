import { z } from 'zod';

export const typeSchema = z.enum(['lead', 'backing', 'instrumental']);
export type Type = z.infer<typeof typeSchema>;
