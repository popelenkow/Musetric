import { BlobFile } from '@musetric/resource-utils/blobStorage';
import { PrismaClient } from '@prisma/client';

export type PendingOriginalItem = {
  projectId: number;
  blobId: string;
};

export type ApplyResultArg = {
  projectId: number;
  vocal: BlobFile;
  instrumental: BlobFile;
};

export const create = (prisma: PrismaClient) => {
  return {
    pendingOriginal: async (): Promise<PendingOriginalItem | undefined> => {
      const original = await prisma.sound.findFirst({
        where: { type: 'original', project: { stage: 'pending' } },
        orderBy: { projectId: 'asc' },
        select: { blobId: true, projectId: true },
      });

      if (!original) {
        return undefined;
      }

      return original;
    },
    applyResult: async (arg: ApplyResultArg): Promise<void> => {
      await prisma.$transaction(async (tx) => {
        await tx.sound.create({
          data: {
            projectId: arg.projectId,
            blobId: arg.vocal.blobId,
            filename: arg.vocal.filename,
            contentType: arg.vocal.contentType,
            type: 'vocal',
          },
        });

        await tx.sound.create({
          data: {
            projectId: arg.projectId,
            blobId: arg.instrumental.blobId,
            filename: arg.instrumental.filename,
            contentType: arg.instrumental.contentType,
            type: 'instrumental',
          },
        });

        await tx.project.update({
          where: { id: arg.projectId },
          data: { stage: 'done' },
        });
      });
    },
  };
};
