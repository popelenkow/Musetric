import { api } from '@musetric/api';
import { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import { assertFound } from '../common/assertFound';
import { prisma } from '../common/prisma';
import { changePreview, createPreview } from '../db/preview';

export const projectRouter: FastifyPluginAsyncZod = async (app) => {
  app.addHook('onRoute', (routeOptions) => {
    if (routeOptions.schema) {
      routeOptions.schema.tags = ['project'];
    }
  });

  app.route({
    ...api.project.list.route,
    handler: async () =>
      prisma.$transaction(async (tx) => {
        const all = await tx.project.findMany({
          orderBy: { id: 'desc' },
          include: { preview: true },
        });
        return all.map((project): api.project.list.Response[number] => ({
          ...project,
          previewUrl: api.preview.get.url(project.preview?.id),
        }));
      }),
  });

  app.route({
    ...api.project.get.route,
    handler: async (request) =>
      prisma.$transaction(async (tx) => {
        const { projectId } = request.params;
        const found = await tx.project.findUnique({
          where: { id: projectId },
          include: { preview: true },
        });
        assertFound(found, `Project with id ${projectId} not found`);
        const result: api.project.get.Response = {
          ...found,
          previewUrl: api.preview.get.url(found.preview?.id),
        };
        return result;
      }),
  });

  app.route({
    ...api.project.create.route,
    handler: async (request) =>
      prisma.$transaction(async (tx) => {
        const { song, name, preview } = request.body;
        const created = await tx.project.create({
          data: { name, stage: 'init' },
        });
        const projectId = created.id;
        const songArrayBuffer = await song.arrayBuffer();
        const songData = Buffer.from(songArrayBuffer);
        await tx.sound.create({
          data: {
            projectId,
            data: songData,
            filename: song.name,
            contentType: song.type,
            type: 'original',
          },
        });
        const createdPreview = await createPreview(tx, projectId, preview);
        const result: api.project.create.Response = {
          ...created,
          previewUrl: api.preview.get.url(createdPreview?.id),
        };
        return result;
      }),
  });

  app.route({
    ...api.project.edit.route,
    handler: async (request) =>
      prisma.$transaction(async (tx) => {
        const { projectId } = request.params;
        const { name, preview, withoutPreview } = request.body;
        const existing = await tx.project.findUnique({
          where: { id: projectId },
        });
        assertFound(existing, `Project with id ${projectId} not found`);
        const updated = await tx.project.update({
          where: { id: projectId },
          data: { name },
        });
        const changedPreview = await changePreview(
          tx,
          projectId,
          preview,
          withoutPreview,
        );
        const result: api.project.edit.Response = {
          ...updated,
          previewUrl: api.preview.get.url(changedPreview?.id),
        };
        return result;
      }),
  });

  app.route({
    ...api.project.remove.route,
    handler: async (request) =>
      prisma.$transaction(async (tx) => {
        const { projectId } = request.params;
        const { count } = await tx.project.deleteMany({
          where: { id: projectId },
        });
        assertFound(
          count || undefined,
          `Project with id ${projectId} not found`,
        );
        return;
      }),
  });

  return Promise.resolve();
};
