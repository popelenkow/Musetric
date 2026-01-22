import { EventEmitter } from '@musetric/resource-utils/eventEmitter';
import { Logger } from '@musetric/resource-utils/logger';
import { separateAudio } from '@musetric/toolkit';
import { FastifyInstance } from 'fastify';
import { envs } from '../../common/envs.js';
import {
  ProcessingWorkerEvent,
  ProcessingWorkerProgressEvent,
} from './processingSummary.js';

export type SeparationTask = {
  projectId: number;
  blobId: string;
};

export type SeparationWorker = {
  run: (task: SeparationTask) => Promise<void>;
  getState: (projectId: number) => ProcessingWorkerProgressEvent | undefined;
};

export const createSeparationWorker = (
  app: FastifyInstance,
  emitter: EventEmitter<ProcessingWorkerEvent>,
  logger: Logger,
): SeparationWorker => {
  let state: ProcessingWorkerProgressEvent | undefined = undefined;

  return {
    run: async (task) => {
      try {
        state = {
          type: 'progress',
          projectId: task.projectId,
          step: 'separation',
          progress: 0,
        };
        emitter.emit(state);

        const sourcePath = app.blobStorage.getPath(task.blobId);
        const lead = app.blobStorage.createPath();
        const backing = app.blobStorage.createPath();
        const instrumental = app.blobStorage.createPath();

        await separateAudio({
          sourcePath,
          leadPath: lead.blobPath,
          backingPath: backing.blobPath,
          instrumentalPath: instrumental.blobPath,
          sampleRate: envs.audioSampleRate,
          outputFormat: envs.audioFormat,
          handlers: {
            progress: (message) => {
              if (!state) {
                return;
              }
              state = {
                ...state,
                progress: message.progress,
              };
              emitter.emit(state);
            },
            download: (message) => {
              if (!state) {
                return;
              }
              state = {
                ...state,
                download: message,
              };
              emitter.emit(state);
            },
          },
          modelsPath: envs.modelsPath,
          logger,
        });

        await app.db.processing.applySeparationResult({
          projectId: task.projectId,
          leadId: lead.blobId,
          backingId: backing.blobId,
          instrumentalId: instrumental.blobId,
        });

        state = undefined;
        emitter.emit({
          type: 'complete',
          projectId: task.projectId,
          step: 'separation',
        });
      } catch (error) {
        emitter.emit({
          type: 'error',
          projectId: task.projectId,
          step: 'separation',
        });
        state = undefined;
        logger.error({ projectId: task.projectId, error }, 'Separation failed');
      }
    },
    getState: (projectId) =>
      state && state.projectId === projectId ? state : undefined,
  };
};
