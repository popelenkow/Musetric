import { basename } from 'node:path';
import { FastifyInstance } from 'fastify';
import {
  createSeparationWorker,
  SeparationWorker,
} from '@musetric/backend-workers';
import { envs } from '../common/envs.js';

declare module 'fastify' {
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
  interface FastifyInstance {
    separationWorker: SeparationWorker;
  }
}

export const registerSeparationWorker = (app: FastifyInstance) => {
  const separationWorker = createSeparationWorker({
    separationIntervalMs: envs.separationIntervalMs,
    modelPath: envs.modelPath,
    modelConfigPath: envs.modelConfigPath,
    sampleRate: envs.sampleRate,
    outputFormat: envs.outputFormat,
    blobStorage: app.blobStorage,
    getNextTask: async () => app.db.separation.pendingOriginal(),
    saveResult: async (result) => {
      app.db.separation.applyResult({
        projectId: result.projectId,
        vocal: {
          blobId: result.vocalBlobId,
          filename: result.vocalBlobId,
          contentType: envs.contentType,
        },
        instrumental: {
          blobId: result.instrumentalBlobId,
          filename: result.instrumentalBlobId,
          contentType: envs.contentType,
        },
      });
    },
    logLevel: envs.logLevel,
    logger: app.log,
  });
  app.addHook('onReady', () => {
    separationWorker.start();
  });
  app.addHook('onClose', () => {
    separationWorker.stop();
  });
  app.decorate('separationWorker', separationWorker);
};
