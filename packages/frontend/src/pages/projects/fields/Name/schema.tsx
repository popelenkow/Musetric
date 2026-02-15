import { type TFunction } from 'i18next';
import { z } from 'zod';

export const nameValueSchema = (t: TFunction) =>
  z
    .string()
    .trim()
    .min(3, {
      message: t('pages.projects.fields.name.errors.emptyName'),
    });
export type NameValue = z.infer<ReturnType<typeof nameValueSchema>>;
