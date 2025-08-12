import { createBlobGarbageCollector } from '@musetric/resource-utils/blobGarbageCollector';
import { FastifyInstance } from 'fastify';
import { envs } from '../common/envs';

export const registerBlobGarbageCollector = (app: FastifyInstance) => {
  const blobGarbageCollector = createBlobGarbageCollector({
    blobStorage: app.blobStorage,
    gcIntervalMs: envs.gcIntervalMs,
    blobRetentionMs: envs.blobRetentionMs,
    getReferencedBlobIds: async (): Promise<string[]> => {
      const [sounds, previews] = await Promise.all([
        app.db.sound.findMany({ select: { blobId: true } }),
        app.db.preview.findMany({ select: { blobId: true } }),
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
