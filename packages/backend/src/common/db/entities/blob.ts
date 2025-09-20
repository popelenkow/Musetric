import { PrismaClient } from '@prisma/client';

export const create = (prisma: PrismaClient) => {
  return {
    list: async (): Promise<string[]> => {
      const [sounds, previews] = await Promise.all([
        prisma.sound.findMany({ select: { blobId: true } }),
        prisma.preview.findMany({ select: { blobId: true } }),
      ]);

      return [
        ...sounds.map((sound) => sound.blobId),
        ...previews.map((previewRecord) => previewRecord.blobId),
      ];
    },
  };
};
