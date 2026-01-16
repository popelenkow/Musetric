import path from 'node:path';
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
  filename: string;
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
        const vocal = app.blobStorage.createPath();
        const instrumental = app.blobStorage.createPath();

        await separateAudio({
          sourcePath,
          vocalPath: vocal.blobPath,
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

        const name = path.parse(task.filename).name;
        await app.db.processing.applySeparationResult({
          projectId: task.projectId,
          vocal: {
            blobId: vocal.blobId,
            filename: `${name}_vocal.${envs.audioFormat}`,
            contentType: envs.audioContentType,
          },
          instrumental: {
            blobId: instrumental.blobId,
            filename: `${name}_instrumental.${envs.audioFormat}`,
            contentType: envs.audioContentType,
          },
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
        logger.error({ projectId: task.projectId, error }, 'Processing failed');
      }
    },
    getState: (projectId) =>
      state && state.projectId === projectId ? state : undefined,
  };
};
