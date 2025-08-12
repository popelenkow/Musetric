import { BlobStorage } from '@musetric/resource-utils/blobStorage';
import { createCallLatest } from '@musetric/resource-utils/callLatest';
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

export type GetNextTask = () => Promise<SeparationTask | undefined>;
export type SaveResult = (result: SeparationResult) => Promise<void>;

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
  getProgress: (projectId: number) => number | undefined;
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

  type SeparationState = {
    projectId: number;
    progress: number;
  };
  let state: SeparationState | undefined = undefined;

  const run = async () => {
    const task = await getNextTask();
    if (!task) {
      return;
    }
    const { projectId, blobId } = task;

    try {
      logger.info(
        { processName: separationProcessName, projectId, blobId },
        'Starting separation',
      );

      const currentState: SeparationState = {
        projectId,
        progress: 0,
      };
      state = currentState;

      const result = await processAudio(blobId, (progress) => {
        currentState.progress = progress;
      });

      await saveResult({
        projectId,
        vocalBlobId: result.vocalBlobId,
        instrumentalBlobId: result.instrumentalBlobId,
      });

      logger.info(
        { processName: separationProcessName, projectId, blobId },
        'Finished separation',
      );
    } catch (error) {
      logger.error(
        { processName: separationProcessName, projectId, blobId, error },
        'Separation failed',
      );
    } finally {
      state = undefined;
    }
  };

  const ref: SeparationWorker = {
    ...createScheduler(createCallLatest(run), separationIntervalMs),
    getProgress: (projectId: number) => {
      if (state?.projectId === projectId) {
        return state.progress;
      }
      return undefined;
    },
  };

  return ref;
};
