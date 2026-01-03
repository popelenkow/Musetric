import { BlobStorage } from '@musetric/resource-utils/blobStorage';
import { createCallLatest } from '@musetric/resource-utils/callLatest';
import {
  createEventEmitter,
  type EventEmitter,
} from '@musetric/resource-utils/eventEmitter';
import { Logger, LogLevel } from '@musetric/resource-utils/logger';
import { createScheduler, Scheduler } from '@musetric/resource-utils/scheduler';
import { separateAudio } from './separateAudio.js';
import { transcribeAudio } from './transcribeAudio.js';

export type ProcessingTask = {
  projectId: number;
  blobId: string;
  filename: string;
};

export type ProcessingResult = {
  projectId: number;
  filename: string;
  vocalBlobId: string;
  instrumentalBlobId: string;
  transcriptionBlobId: string;
};

export type GetNextProcessingTask = () => Promise<ProcessingTask | undefined>;
export type SaveProcessingResult = (result: ProcessingResult) => Promise<void>;

export type ProcessingState = {
  stage: 'separation' | 'transcription';
  projectId: number;
  progress: number;
};

export type ProcessingEvent =
  | ProcessingState
  | { stage: 'done'; projectId: number };

export type CreateProcessingWorkerOptions = {
  processingIntervalMs: number;
  sampleRate: number;
  outputFormat: string;
  blobStorage: BlobStorage;
  getNextTask: GetNextProcessingTask;
  saveResult: SaveProcessingResult;
  logLevel: LogLevel;
  logger: Logger;
};

export type ProcessingWorker = Scheduler & {
  emitter: EventEmitter<ProcessingEvent>;
  getProcessingState: (projectId: number) => ProcessingState | undefined;
};

export const createProcessingWorker = (
  options: CreateProcessingWorkerOptions,
): ProcessingWorker => {
  const {
    processingIntervalMs,
    sampleRate,
    outputFormat,
    blobStorage,
    getNextTask,
    saveResult,
    logLevel,
    logger,
  } = options;

  const emitter = createEventEmitter<ProcessingEvent>();
  let state: ProcessingState | undefined = undefined;

  emitter.subscribe((event) => {
    state = event.stage === 'done' ? undefined : event;
  });

  const run = async () => {
    const task = await getNextTask();
    if (!task) {
      return;
    }
    const { projectId, blobId, filename } = task;

    try {
      const sourcePath = blobStorage.getPath(blobId);
      const vocal = blobStorage.createPath();
      const instrumental = blobStorage.createPath();
      const transcription = blobStorage.createPath();

      emitter.emit({
        stage: 'separation',
        projectId,
        progress: 0,
      });

      await separateAudio({
        sourcePath,
        vocalPath: vocal.blobPath,
        instrumentalPath: instrumental.blobPath,
        sampleRate,
        outputFormat,
        onProgress: (separationProgress: number) => {
          emitter.emit({
            stage: 'separation',
            projectId,
            progress: separationProgress,
          });
        },
        logger,
        logLevel,
      });

      emitter.emit({
        stage: 'transcription',
        projectId,
        progress: 0,
      });

      await transcribeAudio({
        sourcePath: vocal.blobPath,
        resultPath: transcription.blobPath,
        onProgress: (transcriptionProgress: number) => {
          emitter.emit({
            stage: 'transcription',
            projectId,
            progress: transcriptionProgress,
          });
        },
        logger,
        logLevel,
      });

      emitter.emit({
        stage: 'transcription',
        projectId,
        progress: 1,
      });

      await saveResult({
        projectId,
        filename,
        vocalBlobId: vocal.blobId,
        instrumentalBlobId: instrumental.blobId,
        transcriptionBlobId: transcription.blobId,
      });

      emitter.emit({ stage: 'done', projectId });
    } catch (error) {
      state = undefined;
      logger.error({ projectId, error }, 'Processing failed');
    }
  };

  const scheduler = createScheduler(
    createCallLatest(run),
    processingIntervalMs,
  );

  const ref: ProcessingWorker = {
    ...scheduler,
    emitter,
    getProcessingState: (projectId) => {
      return state?.projectId === projectId ? state : undefined;
    },
  };

  return ref;
};
