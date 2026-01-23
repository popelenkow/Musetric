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
import { createValidationWorker } from './processingValidation.js';

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
  const validationWorker = createValidationWorker(app, emitter, logger);
  const separationWorker = createSeparationWorker(app, emitter, logger);
  const transcriptionWorker = createTranscriptionWorker(app, emitter, logger);

  const worker = createSingleWorker({
    intervalMs: envs.processingIntervalMs,
    runNext: async () => {
      const transcription = await app.db.processing.pendingTranscription();
      if (transcription) {
        await transcriptionWorker.run(transcription);
      }

      const separation = await app.db.processing.pendingSeparation();
      if (separation) {
        await separationWorker.run(separation);
      }

      const validation = await app.db.processing.pendingValidation();
      if (validation) {
        await validationWorker.run(validation);
      }
    },
  });

  return {
    ...worker,
    emitter,
    getProcessingState: (projectId) => {
      return (
        transcriptionWorker.getState(projectId) ??
        separationWorker.getState(projectId) ??
        validationWorker.getState(projectId)
      );
    },
  };
};
