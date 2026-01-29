import { EventEmitter } from '@musetric/resource-utils/eventEmitter';
import { Logger } from '@musetric/resource-utils/logger';
import { convertToFmp4, separateAudio } from '@musetric/toolkit';
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

        const masterSourcePath = app.blobStorage.getPath(task.blobId);
        const masterLead = app.blobStorage.createPath();
        const masterBacking = app.blobStorage.createPath();
        const masterInstrumental = app.blobStorage.createPath();

        await separateAudio({
          sourcePath: masterSourcePath,
          leadPath: masterLead.blobPath,
          backingPath: masterBacking.blobPath,
          instrumentalPath: masterInstrumental.blobPath,
          sampleRate: envs.audioSampleRate,
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

        const deliveryLead = app.blobStorage.createPath();
        const deliveryBacking = app.blobStorage.createPath();
        const deliveryInstrumental = app.blobStorage.createPath();
        await Promise.all([
          convertToFmp4({
            fromPath: masterLead.blobPath,
            toPath: deliveryLead.blobPath,
            sampleRate: envs.audioSampleRate,
            logger,
          }),
          convertToFmp4({
            fromPath: masterBacking.blobPath,
            toPath: deliveryBacking.blobPath,
            sampleRate: envs.audioSampleRate,
            logger,
          }),
          convertToFmp4({
            fromPath: masterInstrumental.blobPath,
            toPath: deliveryInstrumental.blobPath,
            sampleRate: envs.audioSampleRate,
            logger,
          }),
        ]);

        await app.db.processing.applySeparationResult({
          projectId: task.projectId,
          master: {
            leadId: masterLead.blobId,
            backingId: masterBacking.blobId,
            instrumentalId: masterInstrumental.blobId,
          },
          delivery: {
            leadId: deliveryLead.blobId,
            backingId: deliveryBacking.blobId,
            instrumentalId: deliveryInstrumental.blobId,
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
        logger.error({ projectId: task.projectId, error }, 'Separation failed');
      }
    },
    getState: (projectId) =>
      state && state.projectId === projectId ? state : undefined,
  };
};
