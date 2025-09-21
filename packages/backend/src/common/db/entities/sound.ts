import { PrismaClient } from '@prisma/client';

export type SoundType = 'original' | 'vocal' | 'instrumental';
export type GetItem = {
  id: number;
  projectId: number;
  type: SoundType;
  blobId: string;
  filename: string;
  contentType: string;
};

export const create = (prisma: PrismaClient) => {
  return {
    get: async (
      projectId: number,
      type: SoundType,
    ): Promise<GetItem | undefined> => {
      const soundRecord = await prisma.sound.findFirst({
        where: { projectId, type },
      });

      if (!soundRecord) {
        return undefined;
      }

      return soundRecord;
    },
  };
};
