import path from 'node:path';
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
    sampleRate: envs.audioSampleRate,
    outputFormat: envs.audioFormat,
    blobStorage: app.blobStorage,
    getNextTask: () => app.db.separation.pendingOriginal(),
    saveResult: (result) => {
      const name = path.parse(result.filename).name;
      return app.db.separation.applyResult({
        projectId: result.projectId,
        vocal: {
          blobId: result.vocalBlobId,
          filename: `${name}_vocal.${envs.audioFormat}`,
          contentType: envs.audioContentType,
        },
        instrumental: {
          blobId: result.instrumentalBlobId,
          filename: `${name}_instrumental.${envs.audioFormat}`,
          contentType: envs.audioContentType,
        },
      });
    },
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
