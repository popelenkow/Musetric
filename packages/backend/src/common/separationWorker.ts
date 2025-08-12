import { separateAudio } from '@musetric/backend-workers';
import { BlobStorage } from '@musetric/resource-utils/blobStorage';
import { createCallLatest } from '@musetric/resource-utils/callLatest';
import { createScheduler, Scheduler } from '@musetric/resource-utils/scheduler';
import { PrismaClient } from '@prisma/client';
import { FastifyBaseLogger } from 'fastify';
import { envs } from './envs';

type SeparationState = { projectId: number; progress: number };

export type SeparationWorker = Scheduler & {
  getProgress: (projectId: number) => number | undefined;
};
export const createSeparationWorker = (
  db: PrismaClient,
  blobStorage: BlobStorage,
  logger: FastifyBaseLogger,
): SeparationWorker => {
  const processAudio = async (
    projectId: number,
    blobId: string,
    onProgress: (progress: number) => void,
  ) => {
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

    await db.$transaction([
      db.sound.create({
        data: {
          projectId,
          blobId: vocal.blobId,
          filename: result.vocal.filename,
          contentType: result.vocal.contentType,
          type: 'vocal',
        },
      }),
      db.sound.create({
        data: {
          projectId,
          blobId: instrumental.blobId,
          filename: result.instrumental.filename,
          contentType: result.instrumental.contentType,
          type: 'instrumental',
        },
      }),
      db.project.update({
        where: { id: projectId },
        data: { stage: 'done' },
      }),
    ]);
  };

  let state: SeparationState | undefined = undefined;
  const separate = async () => {
    const original = await db.sound.findFirst({
      where: { type: 'original', project: { stage: 'pending' } },
      orderBy: { projectId: 'asc' },
      select: { blobId: true, projectId: true },
    });

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

      await processAudio(projectId, blobId, (progress) => {
        newState.progress = progress;
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
