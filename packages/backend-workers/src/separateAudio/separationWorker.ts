import { BlobStorage } from '@musetric/resource-utils/blobStorage';
import { createCallLatest } from '@musetric/resource-utils/callLatest';
import {
  createEventEmitter,
  type EventEmitter,
} from '@musetric/resource-utils/eventEmitter';
import { Logger, LogLevel } from '@musetric/resource-utils/logger';
import { createScheduler, Scheduler } from '@musetric/resource-utils/scheduler';
import { separateAudio, separationProcessName } from './separateAudio.js';

export type SeparationTask = {
  projectId: number;
  blobId: string;
  filename: string;
};

export type SeparationResult = {
  projectId: number;
  filename: string;
  vocalBlobId: string;
  instrumentalBlobId: string;
};

export type GetNextTask = () => SeparationTask | undefined;
export type SaveResult = (result: SeparationResult) => void;

export type SeparationWorkerStatus =
  | { stage: 'progress'; projectId: number; separationProgress: number }
  | { stage: 'done'; projectId: number }
  | { stage: 'pending'; projectId: number };

export type SeparationWorkerStatusUpdates =
  EventEmitter<SeparationWorkerStatus>;

export type CreateSeparationWorkerOptions = {
  separationIntervalMs: number;
  sampleRate: number;
  outputFormat: string;
  blobStorage: BlobStorage;
  getNextTask: GetNextTask;
  saveResult: SaveResult;
  logLevel: LogLevel;
  logger: Logger;
};

export type SeparationWorker = Scheduler & {
  emitter: SeparationWorkerStatusUpdates;
  getSeparationProcess: (projectId: number) => number | undefined;
};

export const createSeparationWorker = (
  options: CreateSeparationWorkerOptions,
): SeparationWorker => {
  const {
    separationIntervalMs,
    sampleRate,
    outputFormat,
    blobStorage,
    getNextTask,
    saveResult,
    logLevel,
    logger,
  } = options;

  const emitter = createEventEmitter<SeparationWorkerStatus>();
  type SeparationState = {
    projectId: number;
    separationProgress: number;
  };
  let separationState: SeparationState | undefined = undefined;

  emitter.subscribe((event) => {
    separationState =
      event.stage === 'progress'
        ? {
            projectId: event.projectId,
            separationProgress: event.separationProgress,
          }
        : undefined;
  });

  const processAudio = async (
    blobId: string,
    onProgress: (separationProgress: number) => void,
  ) => {
    const sourcePath = blobStorage.getPath(blobId);
    const vocal = blobStorage.createPath();
    const instrumental = blobStorage.createPath();

    await separateAudio({
      sourcePath,
      vocalPath: vocal.blobPath,
      instrumentalPath: instrumental.blobPath,
      sampleRate,
      outputFormat,
      onProgress,
      logger,
      logLevel,
    });

    return {
      vocalBlobId: vocal.blobId,
      instrumentalBlobId: instrumental.blobId,
    };
  };

  const run = async () => {
    const task = getNextTask();
    if (!task) {
      return;
    }
    const { projectId, blobId, filename } = task;

    try {
      logger.info(
        { processName: separationProcessName, projectId, blobId },
        'Starting separation',
      );

      emitter.emit({ stage: 'progress', projectId, separationProgress: 0 });

      const result = await processAudio(blobId, (separationProgress) => {
        emitter.emit({ stage: 'progress', projectId, separationProgress });
      });

      saveResult({
        projectId,
        filename,
        vocalBlobId: result.vocalBlobId,
        instrumentalBlobId: result.instrumentalBlobId,
      });

      emitter.emit({ stage: 'done', projectId });
      logger.info(
        { processName: separationProcessName, projectId, blobId },
        'Finished separation',
      );
    } catch (error) {
      emitter.emit({ stage: 'pending', projectId });
      logger.error(
        { processName: separationProcessName, projectId, blobId, error },
        'Separation failed',
      );
    }
  };

  const scheduler = createScheduler(
    createCallLatest(run),
    separationIntervalMs,
  );

  const ref: SeparationWorker = {
    ...scheduler,
    emitter,
    getSeparationProcess: (projectId) => {
      return separationState?.projectId === projectId
        ? separationState.separationProgress
        : undefined;
    },
  };

  return ref;
};
