import { z } from 'zod';

export const wordSchema = z.object({
  text: z.string(),
  start: z.number(),
  end: z.number(),
});

export const segmentSchema = z.object({
  text: z.string(),
  start: z.number(),
  end: z.number(),
  words: z.array(wordSchema),
});

export type Word = z.infer<typeof wordSchema>;
export type Segment = z.infer<typeof segmentSchema>;
