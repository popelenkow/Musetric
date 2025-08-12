import { api } from '@musetric/api';
import { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import { assertFound } from '../common/assertFound';
import { blobStorage } from '../common/blobStorage';
import { prisma } from '../common/prisma';
import { separateProjectAudio } from '../services/separationService';
import {
  getSeparationProgress,
  clearSeparationProgress,
  isAnyProjectProcessing,
  setSeparationProgress,
} from '../services/separationState';

let workerInterval: NodeJS.Timeout | undefined = undefined;

const processProjectSeparation = async (projectId: number) => {
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
    });
  } catch (error) {
    console.error(`Failed to process project ${projectId}:`, error);
    throw error;
  }
};

const processSeparationQueue = async () => {
  if (isAnyProjectProcessing()) {
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
    await processProjectSeparation(project.id);
  } catch (error) {
    console.error(`Failed to process project ${project.id}:`, error);
    await prisma.project.update({
      where: { id: project.id },
      data: { stage: 'pending' },
    });
    clearSeparationProgress(project.id);
  }
};

const startSeparationWorker = () => {
  if (workerInterval) return;

  workerInterval = setInterval(() => {
    void processSeparationQueue().catch((error) => {
      console.error('Separation queue processing error:', error);
    });
  }, 10000);
};

export const projectRouter: FastifyPluginAsyncZod = async (app) => {
  app.addHook('onRoute', (routeOptions) => {
    if (routeOptions.schema) {
      routeOptions.schema.tags = ['project'];
    }
  });

  app.route({
    ...api.project.list.route,
    handler: async () => {
      const all = await prisma.project.findMany({
        orderBy: { id: 'desc' },
        include: { preview: true },
      });
      return all.map((project): api.project.list.Response[number] => {
        const separationState = getSeparationProgress(project.id);
        return {
          ...project,
          previewUrl: api.preview.get.url(project.preview?.id),
          progressPercent: separationState
            ? separationState.progress
            : undefined,
        };
      });
    },
  });

  app.route({
    ...api.project.get.route,
    handler: async (request) => {
      const { projectId } = request.params;
      const found = await prisma.project.findUnique({
        where: { id: projectId },
        include: { preview: true },
      });
      assertFound(found, `Project with id ${projectId} not found`);
      const result: api.project.get.Response = {
        ...found,
        previewUrl: api.preview.get.url(found.preview?.id),
      };
      return result;
    },
  });

  app.route({
    ...api.project.create.route,
    handler: async (request) => {
      const { song, name, preview } = request.body;

      const blobSong = await blobStorage.addFile(song);
      const blobPreview = preview
        ? await blobStorage.addFile(preview)
        : undefined;

      return await prisma.$transaction(
        async (tx): Promise<api.project.create.Response> => {
          const created = await tx.project.create({
            data: { name, stage: 'pending' },
          });
          const projectId = created.id;

          await tx.sound.create({
            data: {
              projectId,
              blobId: blobSong.blobId,
              filename: blobSong.filename,
              contentType: blobSong.contentType,
              type: 'original',
            },
          });

          const createdPreview = blobPreview
            ? await tx.preview.create({
                data: {
                  projectId,
                  blobId: blobPreview.blobId,
                  filename: blobPreview.filename,
                  contentType: blobPreview.contentType,
                },
              })
            : undefined;

          return {
            ...created,
            previewUrl: api.preview.get.url(createdPreview?.id),
          };
        },
      );
    },
  });

  app.route({
    ...api.project.edit.route,
    handler: async (request) => {
      const { projectId } = request.params;
      const { name, preview, withoutPreview } = request.body;

      const blobPreview = preview
        ? await blobStorage.addFile(preview)
        : undefined;

      return await prisma.$transaction(
        async (tx): Promise<api.project.edit.Response> => {
          const existing = await tx.project.findUnique({
            where: { id: projectId },
            include: { preview: true },
          });
          assertFound(existing, `Project with id ${projectId} not found`);

          const updated = name
            ? await tx.project.update({
                where: { id: projectId },
                data: { name },
              })
            : existing;

          if (existing.preview && (blobPreview || withoutPreview)) {
            await tx.preview.delete({
              where: { projectId },
            });
          }

          const oldPreview = withoutPreview ? undefined : existing.preview;
          const updatedPreview = blobPreview
            ? await tx.preview.create({
                data: {
                  projectId,
                  blobId: blobPreview.blobId,
                  filename: blobPreview.filename,
                  contentType: blobPreview.contentType,
                },
              })
            : oldPreview;

          return {
            ...updated,
            previewUrl: api.preview.get.url(updatedPreview?.id),
          };
        },
      );
    },
  });

  app.route({
    ...api.project.remove.route,
    handler: async (request) => {
      const { projectId } = request.params;
      const { count } = await prisma.project.deleteMany({
        where: { id: projectId },
      });
      assertFound(count || undefined, `Project with id ${projectId} not found`);
    },
  });

  app.route({
    ...api.project.progress.route,
    handler: async (request) => {
      const { projectId } = request.params;
      const project = await prisma.project.findUnique({
        where: { id: projectId },
        include: { sounds: true },
      });
      assertFound(project, `Project with id ${projectId} not found`);

      const hasVocal = project.sounds.some((sound) => sound.type === 'vocal');
      const hasInstrumental = project.sounds.some(
        (sound) => sound.type === 'instrumental',
      );

      let progressPercent: number | undefined = undefined;
      if (project.stage === 'progress') {
        const separationState = getSeparationProgress(projectId);
        progressPercent = separationState?.progress || 0;
      }

      return {
        stage: project.stage,
        progressPercent,
        hasVocal,
        hasInstrumental,
      };
    },
  });

  startSeparationWorker();

  return Promise.resolve();
};
