import { PrismaClient } from '@prisma/client';
import { blob, preview, project, sound } from './entities';

export const create = () => {
  const prisma = new PrismaClient();
  return {
    project: project.create(prisma),
    preview: preview.create(prisma),
    sound: sound.create(prisma),
    blob: blob.create(prisma),
    disconnect: async (): Promise<void> => prisma.$disconnect(),
  };
};
export type Instance = ReturnType<typeof create>;
