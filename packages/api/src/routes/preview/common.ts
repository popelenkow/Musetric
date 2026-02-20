import { z } from 'zod';

export const itemSchema = z.file({});
export type Item = z.infer<typeof itemSchema>;
