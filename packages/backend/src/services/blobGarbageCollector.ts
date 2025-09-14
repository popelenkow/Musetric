import { createBlobGarbageCollector } from '@musetric/resource-utils/blobGarbageCollector';
import { FastifyInstance } from 'fastify';
import { envs } from '../common/envs';
import { prisma } from '../common/prisma';

export const registerBlobGarbageCollector = (app: FastifyInstance) => {
  const blobGarbageCollector = createBlobGarbageCollector({
    blobStorage: app.blobStorage,
    gcIntervalMs: envs.gcIntervalMs,
    blobRetentionMs: envs.blobRetentionMs,
    getReferencedBlobIds: async (): Promise<string[]> => {
      const [sounds, previews] = await Promise.all([
        prisma.sound.findMany({ select: { blobId: true } }),
        prisma.preview.findMany({ select: { blobId: true } }),
      ]);

      return [
        ...sounds.map((sound) => sound.blobId),
        ...previews.map((preview) => preview.blobId),
      ];
    },
  });

  app.addHook('onReady', () => {
    blobGarbageCollector.start();
  });

  app.addHook('onClose', () => {
    blobGarbageCollector.stop();
  });
};
