import { api } from '@musetric/api';
import { Prisma } from '@prisma/client';
import { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
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
    handler: () =>
      prisma.$transaction(async (tx: Prisma.TransactionClient) => {
        const all = await tx.project.findMany({
          orderBy: { id: 'desc' },
          include: { preview: true },
        });
        return all.map(
          (project: Prisma.Project & { preview: Prisma.Preview | null }) => ({
            ...project,
            previewUrl: api.preview.get.url(project.preview?.id),
          }),
        );
      }),
  });

  app.route({
    ...api.project.get.route,
    handler: (request, reply) =>
      prisma.$transaction(async (tx: Prisma.TransactionClient) => {
        const { projectId } = request.params;
        const found = await tx.project.findUnique({
          where: { id: projectId },
          include: { preview: true },
        });
        if (!found) {
          reply.code(404);
          return { message: `Project with id ${projectId} not found` };
        }
        const result: api.project.get.Response = {
          ...found,
          previewUrl: api.preview.get.url(found.preview?.id),
        };
        return result;
      }),
  });

  app.route({
    ...api.project.create.route,
    handler: (request) =>
      prisma.$transaction(async (tx: Prisma.TransactionClient) => {
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
    handler: (request, reply) =>
      prisma.$transaction(async (tx: Prisma.TransactionClient) => {
        const { projectId } = request.params;
        const { name, preview, withoutPreview } = request.body;
        const existing = await tx.project.findUnique({
          where: { id: projectId },
        });
        if (!existing) {
          reply.code(404);
          return { message: `Project with id ${projectId} not found` };
        }
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
    handler: (request, reply) =>
      prisma.$transaction(async (tx: Prisma.TransactionClient) => {
        const { projectId } = request.params;
        const existing = await tx.project.findUnique({
          where: { id: projectId },
          include: { preview: true },
        });
        if (!existing) {
          reply.code(404);
          return { message: `Project with id ${projectId} not found` };
        }
        await tx.project.delete({ where: { id: projectId } });
        return;
      }),
  });
};
