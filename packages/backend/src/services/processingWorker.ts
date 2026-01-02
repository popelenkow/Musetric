import path from 'node:path';
import { bindLogger } from '@musetric/resource-utils/logger';
import { createProcessingWorker, ProcessingWorker } from '@musetric/toolkit';
import { FastifyInstance } from 'fastify';
import { envs } from '../common/envs.js';

declare module 'fastify' {
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
  interface FastifyInstance {
    processingWorker: ProcessingWorker;
  }
}

export const registerProcessingWorker = (app: FastifyInstance) => {
  const processingWorker = createProcessingWorker({
    processingIntervalMs: envs.processingIntervalMs,
    sampleRate: envs.audioSampleRate,
    outputFormat: envs.audioFormat,
    blobStorage: app.blobStorage,
    getNextTask: () => app.db.processing.pendingOriginal(),
    saveResult: (result) => {
      const name = path.parse(result.filename).name;
      return app.db.processing.applyResult({
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
        transcriptionBlobId: result.transcriptionBlobId,
      });
    },
    logLevel: envs.logLevel,
    logger: bindLogger(app.log),
  });
  app.addHook('onReady', () => {
    processingWorker.start();
  });
  app.addHook('onClose', () => {
    processingWorker.stop();
  });
  app.decorate('processingWorker', processingWorker);
};
