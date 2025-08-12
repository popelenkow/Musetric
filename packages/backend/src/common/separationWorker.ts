import { separateAudio } from '@musetric/backend-workers';
import { BlobFile, BlobStorage } from '@musetric/resource-utils/blobStorage';
import { createCallLatest } from '@musetric/resource-utils/callLatest';
import { createScheduler, Scheduler } from '@musetric/resource-utils/scheduler';
import { FastifyBaseLogger } from 'fastify';
import { DB } from './db';
import { envs } from './envs';

type SeparationState = { projectId: number; progress: number };
type ProcessAudioResult = {
  vocal: BlobFile;
  instrumental: BlobFile;
};

export type SeparationWorker = Scheduler & {
  getProgress: (projectId: number) => number | undefined;
};
export const createSeparationWorker = (
  db: DB.Instance,
  blobStorage: BlobStorage,
  logger: FastifyBaseLogger,
): SeparationWorker => {
  const processAudio = async (
    blobId: string,
    onProgress: (progress: number) => void,
  ): Promise<ProcessAudioResult> => {
    const sourcePath = blobStorage.getPath(blobId);
    const vocal = blobStorage.createPath();
    const instrumental = blobStorage.createPath();

    const result = await separateAudio({
      sourcePath,
      vocalPath: vocal.blobPath,
      instrumentalPath: instrumental.blobPath,
      onProgress,
      logger,
      logLevel: envs.logLevel,
    });

    return {
      vocal: {
        blobId: vocal.blobId,
        filename: result.vocal.filename,
        contentType: result.vocal.contentType,
      },
      instrumental: {
        blobId: instrumental.blobId,
        filename: result.instrumental.filename,
        contentType: result.instrumental.contentType,
      },
    };
  };

  let state: SeparationState | undefined = undefined;
  const separate = async () => {
    const original = await db.separation.pendingOriginal();

    if (!original) {
      return;
    }
    const { projectId, blobId } = original;

    try {
      logger.info({ projectId, blobId }, 'Starting separation');
      const newState: SeparationState = {
        projectId,
        progress: 0,
      };
      state = newState;

      const generated = await processAudio(blobId, (progress) => {
        newState.progress = progress;
      });

      await db.separation.applyResult({
        projectId,
        vocal: generated.vocal,
        instrumental: generated.instrumental,
      });

      logger.info({ projectId, blobId }, 'Finished separation');
    } catch (error) {
      logger.error({ projectId, blobId, error }, 'Separation failed');
    } finally {
      state = undefined;
    }
  };

  const ref: SeparationWorker = {
    ...createScheduler(createCallLatest(separate), envs.separationIntervalMs),
    getProgress: (projectId: number) => {
      if (state?.projectId === projectId) {
        return state.progress;
      }
      return undefined;
    },
  };

  return ref;
};
