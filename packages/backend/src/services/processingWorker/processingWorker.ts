import {
  createEventEmitter,
  EventEmitter,
} from '@musetric/resource-utils/eventEmitter';
import { bindLogger } from '@musetric/resource-utils/logger';
import {
  createSingleWorker,
  SingleWorker,
} from '@musetric/resource-utils/singleWorker';
import { FastifyInstance } from 'fastify';
import { envs } from '../../common/envs.js';
import { createSeparationWorker } from './processingSeparation.js';
import {
  ProcessingWorkerEvent,
  ProcessingWorkerProgressEvent,
} from './processingSummary.js';
import { createTranscriptionWorker } from './processingTranscription.js';

export type ProcessingWorker = SingleWorker & {
  emitter: EventEmitter<ProcessingWorkerEvent>;
  getProcessingState: (
    projectId: number,
  ) => ProcessingWorkerProgressEvent | undefined;
};

export const createProcessingWorker = (
  app: FastifyInstance,
): ProcessingWorker => {
  const emitter = createEventEmitter<ProcessingWorkerEvent>();
  const logger = bindLogger(app.log, envs.logLevel);
  const separationWorker = createSeparationWorker(app, emitter, logger);
  const transcriptionWorker = createTranscriptionWorker(app, emitter, logger);

  const worker = createSingleWorker({
    intervalMs: envs.processingIntervalMs,
    getNextTask: async () => {
      const pendingTranscription =
        await app.db.processing.pendingTranscription();
      if (pendingTranscription) {
        return async () => transcriptionWorker.run(pendingTranscription);
      }

      const pendingSeparation = await app.db.processing.pendingSeparation();
      if (pendingSeparation) {
        return async () => separationWorker.run(pendingSeparation);
      }

      return undefined;
    },
  });

  return {
    ...worker,
    emitter,
    getProcessingState: (projectId) => {
      return (
        transcriptionWorker.getState(projectId) ??
        separationWorker.getState(projectId)
      );
    },
  };
};
