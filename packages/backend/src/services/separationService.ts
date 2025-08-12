import fs from 'fs';
import path from 'path';
import {
  separateAudio,
  type SeparationProgress,
} from '@musetric/backend-workers/src/separate/index.js';
import { blobStorage } from '../common/blobStorage';
import { prisma } from '../common/prisma';
import {
  setSeparationProgress,
  clearSeparationProgress,
} from './separationState';

export type SeparationOptions = {
  projectId: number;
  onProgress?: (progress: SeparationProgress) => void;
};

export const separateProjectAudio = async (options: SeparationOptions) => {
  const { projectId, onProgress } = options;

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

  // Update project stage to pending if in init
  if (project.stage === 'init') {
    await prisma.project.update({
      where: { id: projectId },
      data: { stage: 'pending' },
    });
    setSeparationProgress(projectId, 0, 'pending', originalSound.blobId);
  }

  // Update to progress stage
  await prisma.project.update({
    where: { id: projectId },
    data: { stage: 'progress' },
  });
  setSeparationProgress(projectId, 0, 'initializing', originalSound.blobId);

  // Get original file from blob storage
  const originalFileBuffer = await blobStorage.get(originalSound.blobId);
  if (!originalFileBuffer) {
    throw new Error(`Original file not found: ${originalSound.blobId}`);
  }

  // Create temporary directory and file paths
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

  // Write original file to temp location
  fs.writeFileSync(inputPath, originalFileBuffer);

  try {
    // Separate audio with progress callback
    const result = await separateAudio(
      inputPath,
      vocalPath,
      instrumentalPath,
      (progress: SeparationProgress) => {
        setSeparationProgress(
          projectId,
          progress.progress || 0,
          progress.stage,
          originalSound.blobId,
        );
        if (onProgress) {
          onProgress(progress);
        }
      },
    );

    // Store separated files in blob storage
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

    // Create sound records and update project status
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

    // Clean up temp files
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
    // Clean up temp files on error
    [inputPath, vocalPath, instrumentalPath].forEach((filePath) => {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    });

    clearSeparationProgress(projectId);
    throw error;
  }
};
