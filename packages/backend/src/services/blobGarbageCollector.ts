import { createBlobGarbageCollector } from '@musetric/resource-utils/blobGarbageCollector';
import { FastifyInstance } from 'fastify';
import { envs } from '../common/envs';

export const registerBlobGarbageCollector = (app: FastifyInstance) => {
  const blobGarbageCollector = createBlobGarbageCollector({
    blobStorage: app.blobStorage,
    gcIntervalMs: envs.gcIntervalMs,
    blobRetentionMs: envs.blobRetentionMs,
    getReferencedBlobIds: async () => Promise.resolve(app.db.blob.list()),
  });

  app.addHook('onReady', () => {
    blobGarbageCollector.start();
  });

  app.addHook('onClose', () => {
    blobGarbageCollector.stop();
  });
};
