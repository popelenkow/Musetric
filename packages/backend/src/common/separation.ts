import fs from 'fs';
import path from 'path';
import { separateAudio } from '@musetric/backend-workers';
import { createCallLatest } from '@musetric/resource-utils/callLatest';
import { FastifyBaseLogger } from 'fastify';
import { blobStorage } from '../index';
import { prisma } from './prisma';
import { createScheduler, Scheduler } from './scheduler';

const separationStates = new Map<number, { progress: number; stage: string }>();

export const setSeparationProgress = (
  projectId: number,
  progress: number,
  stage: string,
) => {
  separationStates.set(projectId, { progress, stage });
};

export const getSeparationProgress = (projectId: number) => {
  return separationStates.get(projectId);
};

export const clearSeparationProgress = (projectId: number) => {
  separationStates.delete(projectId);
};

const separateProjectAudio = async (
  projectId: number,
  logger: FastifyBaseLogger,
) => {
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    include: { sounds: true },
  });

  if (!project) {
    throw new Error(`Project ${projectId} not found`);
  }

  const originalSound = project.sounds.find((s) => s.type === 'original');
  if (!originalSound) {
    throw new Error(`No original sound found for project ${projectId}`);
  }

  setSeparationProgress(projectId, 0, 'initializing');

  const originalFileBuffer = await blobStorage.get(originalSound.blobId);
  if (!originalFileBuffer) {
    throw new Error(`Original file not found: ${originalSound.blobId}`);
  }

  const tempDir = path.resolve(process.cwd(), 'tmp');
  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
  }

  const inputPath = path.resolve(
    tempDir,
    `input-${projectId}-${originalSound.filename}`,
  );
  const vocalPath = path.resolve(tempDir, `vocal-${projectId}.flac`);
  const instrumentalPath = path.resolve(
    tempDir,
    `instrumental-${projectId}.flac`,
  );

  fs.writeFileSync(inputPath, originalFileBuffer);

  try {
    const result = await separateAudio({
      inputPath,
      vocalPath,
      instrumentalPath,
      onProgress: (progress) =>
        setSeparationProgress(
          projectId,
          progress.progress || 0,
          progress.stage,
        ),
      logger,
      logLevel: 'info',
    });

    const vocalBuffer = fs.readFileSync(vocalPath);
    const instrumentalBuffer = fs.readFileSync(instrumentalPath);

    const [vocalBlobId, instrumentalBlobId] = await Promise.all([
      blobStorage.add(vocalBuffer),
      blobStorage.add(instrumentalBuffer),
    ]);

    await prisma.$transaction([
      prisma.sound.create({
        data: {
          projectId,
          blobId: vocalBlobId,
          filename: result.vocal.filename,
          contentType: result.vocal.contentType,
          type: 'vocal',
        },
      }),
      prisma.sound.create({
        data: {
          projectId,
          blobId: instrumentalBlobId,
          filename: result.instrumental.filename,
          contentType: result.instrumental.contentType,
          type: 'instrumental',
        },
      }),
      prisma.project.update({
        where: { id: projectId },
        data: { stage: 'done' },
      }),
    ]);

    [inputPath, vocalPath, instrumentalPath].forEach((filePath) => {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    });

    clearSeparationProgress(projectId);
  } catch (error) {
    [inputPath, vocalPath, instrumentalPath].forEach((filePath) => {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    });
    clearSeparationProgress(projectId);
    throw error;
  }
};

export const createSeparationWorker = (
  logger: FastifyBaseLogger,
): Scheduler => {
  const processQueue = async () => {
    const project = await prisma.project.findFirst({
      where: { stage: 'pending' },
      orderBy: { id: 'asc' },
    });

    if (!project) {
      return;
    }

    try {
      await separateProjectAudio(project.id, logger);
    } catch (error) {
      logger.error(`Failed to process project ${project.id}: ${error}`);
      clearSeparationProgress(project.id);
    }
  };

  return createScheduler(createCallLatest(processQueue), 10000);
};
