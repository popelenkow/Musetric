import { FastifyBaseLogger } from 'fastify';
import { separateProjectAudio } from '../services/separationService';
import {
  clearSeparationProgress,
  setSeparationProgress,
} from '../services/separationState';
import { prisma } from './prisma';

let workerInterval: NodeJS.Timeout | undefined = undefined;
const currentlyProcessing = new Set<number>();

const processProjectSeparation = async (
  projectId: number,
  logger: FastifyBaseLogger,
) => {
  currentlyProcessing.add(projectId);
  try {
    await separateProjectAudio({
      projectId,
      onProgress: (progress) => {
        setSeparationProgress(
          projectId,
          progress.progress || 0,
          progress.stage,
          '',
        );
      },
      logger,
    });
  } catch (error) {
    logger.error(`Failed to process project ${projectId}: ${error}`);
    throw error;
  } finally {
    currentlyProcessing.delete(projectId);
  }
};

const createProcessSeparationQueue =
  (logger: FastifyBaseLogger) => async () => {
    if (currentlyProcessing.size > 0) {
      return;
    }

    const projectsToProcess = await prisma.project.findMany({
      where: {
        stage: 'pending',
      },
      include: { sounds: true },
      orderBy: { id: 'asc' },
      take: 1,
    });

    if (projectsToProcess.length === 0) {
      return;
    }

    const project = projectsToProcess[0];

    try {
      await processProjectSeparation(project.id, logger);
    } catch (error) {
      logger.error(`Failed to process project ${project.id}: ${error}`);
      clearSeparationProgress(project.id);
    }
  };

export const startSeparationWorker = (logger: FastifyBaseLogger) => {
  if (workerInterval) return;

  const processSeparationQueue = createProcessSeparationQueue(logger);

  workerInterval = setInterval(() => {
    void processSeparationQueue().catch((error) => {
      logger.error('Separation queue processing error:', error);
    });
  }, 10000);
};
