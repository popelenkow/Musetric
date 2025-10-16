import {
  createSeparationWorker,
  SeparationWorker,
} from '@musetric/backend-workers';
import { bindLogger } from '@musetric/resource-utils/logger';
import { FastifyInstance } from 'fastify';
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
    sampleRate: envs.separationSampleRate,
    outputFormat: envs.separationOutputFormat,
    blobStorage: app.blobStorage,
    getNextTask: () => app.db.separation.pendingOriginal(),
    saveResult: (result) =>
      app.db.separation.applyResult({
        projectId: result.projectId,
        vocal: {
          blobId: result.vocalBlobId,
          filename: result.vocalBlobId,
          contentType: envs.separationContentType,
        },
        instrumental: {
          blobId: result.instrumentalBlobId,
          filename: result.instrumentalBlobId,
          contentType: envs.separationContentType,
        },
      }),
    logLevel: envs.logLevel,
    logger: bindLogger(app.log),
  });
  app.addHook('onReady', () => {
    separationWorker.start();
  });
  app.addHook('onClose', () => {
    separationWorker.stop();
  });
  app.decorate('separationWorker', separationWorker);
};
