import path from 'node:path';
import { api } from '@musetric/api';
import { FastifyPluginAsyncZod } from '@musetric/fastify-type-provider-zod';
import { prisma } from '../common/prisma';

export const projectRouter: FastifyPluginAsyncZod = async (app) => {
  app.addHook('onRoute', (routeOptions) => {
    if (routeOptions.schema) {
      routeOptions.schema.tags = ['project'];
    }
  });

  app.route({
    ...api.project.list.route,
    handler: () =>
      prisma.$transaction(async (tx) => {
        const all = await tx.project.findMany({ include: { preview: true } });
        return all.map((project) => ({
          ...project,
          previewId: project.preview?.id,
        }));
      }),
  });

  app.route({
    ...api.project.get.route,
    handler: (request, reply) =>
      prisma.$transaction(async (tx) => {
        const { projectId } = request.params;
        const found = await tx.project.findUnique({
          where: { id: projectId },
          include: { preview: true },
        });
        if (!found) {
          reply.code(404);
          return { message: `Project with id ${projectId} not found` };
        }
        return {
          ...found,
          previewId: found.preview?.id,
        };
      }),
  });

  app.route({
    ...api.project.create.route,
    handler: (request) =>
      prisma.$transaction(async (tx) => {
        const { file } = request.body;
        const name = path.parse(file.name).name;
        const created = await tx.project.create({
          data: { name, stage: 'init' },
        });
        const arrayBuffer = await file.arrayBuffer();
        const data = Buffer.from(arrayBuffer);
        await tx.sound.create({
          data: {
            projectId: created.id,
            data,
            filename: file.name,
            contentType: file.type,
            type: 'original',
          },
        });
        return created;
      }),
  });

  app.route({
    ...api.project.rename.route,
    handler: (request, reply) =>
      prisma.$transaction(async (tx) => {
        const { projectId } = request.params;
        const { name } = request.body;
        const existing = await tx.project.findUnique({
          where: { id: projectId },
          include: { preview: true },
        });
        if (!existing) {
          reply.code(404);
          return { message: `Project with id ${projectId} not found` };
        }
        const updated = await tx.project.update({
          where: { id: projectId },
          data: { name },
          include: { preview: true },
        });
        return {
          ...updated,
          previewId: updated.preview?.id,
        };
      }),
  });

  app.route({
    ...api.project.remove.route,
    handler: (request, reply) =>
      prisma.$transaction(async (tx) => {
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
