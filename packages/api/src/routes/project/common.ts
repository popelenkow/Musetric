import { z } from 'zod';

export const downloadStatusSchema = z.enum(['processing', 'cached', 'done']);
export type DownloadStatus = z.infer<typeof downloadStatusSchema>;

export const downloadSchema = z.object({
  label: z.string(),
  file: z.string().optional(),
  downloaded: z.number(),
  total: z.number().optional(),
  status: downloadStatusSchema.optional(),
});
export type Download = z.infer<typeof downloadSchema>;

export const processingStepStatusSchema = z.enum([
  'pending',
  'processing',
  'done',
]);
export type ProcessingStepStatus = z.infer<typeof processingStepStatusSchema>;

export const processingStepSchema = z.object({
  status: processingStepStatusSchema,
  progress: z.number().optional(),
  download: downloadSchema.optional(),
});
export type ProcessingStep = z.infer<typeof processingStepSchema>;

export const processingSchema = z.object({
  done: z.boolean().optional(),
  steps: z.object({
    validation: processingStepSchema,
    separation: processingStepSchema,
    transcription: processingStepSchema,
  }),
});
export type Processing = z.infer<typeof processingSchema>;

export const itemSchema = z.object({
  id: z.number(),
  name: z.string().min(3),
  previewUrl: z.string().optional(),
  processing: processingSchema,
});
export type Item = z.infer<typeof itemSchema>;
