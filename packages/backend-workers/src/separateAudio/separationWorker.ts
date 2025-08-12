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
};

export type SeparationResult = {
  projectId: number;
  vocalBlobId: string;
  instrumentalBlobId: string;
};

export type GetNextTask = () => SeparationTask | undefined;
export type SaveResult = (result: SeparationResult) => void;

export type SeparationWorkerStatus =
  | { stage: 'progress'; projectId: number; progress: number }
  | { stage: 'done'; projectId: number }
  | { stage: 'pending'; projectId: number };

export type SeparationWorkerStatusUpdates =
  EventEmitter<SeparationWorkerStatus>;

export type CreateSeparationWorkerOptions = {
  separationIntervalMs: number;
  modelPath: string;
  modelConfigPath: string;
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
};

export const createSeparationWorker = (
  options: CreateSeparationWorkerOptions,
): SeparationWorker => {
  const {
    separationIntervalMs,
    modelPath,
    modelConfigPath,
    sampleRate,
    outputFormat,
    blobStorage,
    getNextTask,
    saveResult,
    logLevel,
    logger,
  } = options;

  const emitter = createEventEmitter<SeparationWorkerStatus>();

  const processAudio = async (
    blobId: string,
    onProgress: (progress: number) => void,
  ) => {
    const sourcePath = blobStorage.getPath(blobId);
    const vocal = blobStorage.createPath();
    const instrumental = blobStorage.createPath();

    await separateAudio({
      sourcePath,
      vocalPath: vocal.blobPath,
      instrumentalPath: instrumental.blobPath,
      modelPath,
      modelConfigPath,
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
    const { projectId, blobId } = task;

    try {
      logger.info(
        { processName: separationProcessName, projectId, blobId },
        'Starting separation',
      );

      emitter.emit({ stage: 'progress', projectId, progress: 0 });

      const result = await processAudio(blobId, (progress) => {
        emitter.emit({ stage: 'progress', projectId, progress });
      });

      saveResult({
        projectId,
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
  };

  return ref;
};
