import fs from 'fs';
import path from 'path';
import {
  separateAudio,
  type SeparationProgress,
} from '@musetric/backend-workers';
import { FastifyBaseLogger } from 'fastify';
import { blobStorage } from '../common/blobStorage';
import { prisma } from '../common/prisma';
import {
  setSeparationProgress,
  clearSeparationProgress,
} from './separationState';

export type SeparationOptions = {
  projectId: number;
  onProgress: (progress: SeparationProgress) => void;
  logger: FastifyBaseLogger;
};

export type SeparationResult = {
  vocal: {
    blobId: string;
    filename: string;
    contentType: string;
  };
  instrumental: {
    blobId: string;
    filename: string;
    contentType: string;
  };
};

export const separateProjectAudio = async (
  options: SeparationOptions,
): Promise<SeparationResult> => {
  const { projectId, onProgress, logger } = options;

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

  setSeparationProgress(projectId, 0, 'initializing', originalSound.blobId);

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
      onProgress: (progress) => {
        setSeparationProgress(
          projectId,
          progress.progress || 0,
          progress.stage,
          originalSound.blobId,
        );
        onProgress(progress);
      },
      logger,
      logLevel: 'info',
    });

    const vocalBuffer = fs.readFileSync(vocalPath);
    const instrumentalBuffer = fs.readFileSync(instrumentalPath);

    const vocalBlobId = await blobStorage.add(vocalBuffer);
    const instrumentalBlobId = await blobStorage.add(instrumentalBuffer);

    const vocalBlob = {
      blobId: vocalBlobId,
      filename: result.vocal.filename,
      contentType: result.vocal.contentType,
    };
    const instrumentalBlob = {
      blobId: instrumentalBlobId,
      filename: result.instrumental.filename,
      contentType: result.instrumental.contentType,
    };

    await prisma.$transaction([
      prisma.sound.create({
        data: {
          projectId,
          blobId: vocalBlob.blobId,
          filename: vocalBlob.filename,
          contentType: vocalBlob.contentType,
          type: 'vocal',
        },
      }),
      prisma.sound.create({
        data: {
          projectId,
          blobId: instrumentalBlob.blobId,
          filename: instrumentalBlob.filename,
          contentType: instrumentalBlob.contentType,
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

    return {
      vocal: vocalBlob,
      instrumental: instrumentalBlob,
    };
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
