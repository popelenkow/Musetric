import { PrismaClient } from '@prisma/client';

export type GetItem = {
  id: number;
  projectId: number;
  blobId: string;
  filename: string;
  contentType: string;
};

export const create = (prisma: PrismaClient) => {
  return {
    get: async (previewId: number): Promise<GetItem | undefined> => {
      const preview = await prisma.preview.findUnique({
        where: { id: previewId },
      });

      if (!preview) {
        return undefined;
      }

      return preview;
    },
  };
};
