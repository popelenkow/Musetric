import { api } from '@musetric/api';
import { FastifyPluginAsyncZod } from '@musetric/fastify-type-provider-zod';
import { prisma } from '../common/prisma';

export const projectRouter: FastifyPluginAsyncZod = async (app) => {
  app.addHook('onRoute', (routeOptions) => {
    if (routeOptions.schema) {
      routeOptions.schema.tags = ['project'];
    }
  });

  app.get(
    api.project.list.route,
    {
      schema: { response: { 200: api.project.list.responseSchema } },
    },
    (_, reply) =>
      prisma.$transaction(async (tx) => {
        const all = await tx.project.findMany({ include: { preview: true } });
        reply.code(200);
        return all.map((project) => ({
          ...project,
          previewId: project.preview?.id,
        }));
      }),
  );

  app.get(
    api.project.get.route,
    {
      schema: {
        params: api.project.get.paramsSchema,
        response: {
          200: api.project.get.responseSchema,
          404: api.common.error.responseSchema,
        },
      },
    },
    (request, reply) =>
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
        reply.code(200);
        return {
          ...found,
          previewId: found.preview?.id,
        };
      }),
  );

  app.post(
    api.project.create.route,
    {
      schema: {
        body: api.project.create.requestSchema,
        response: { 201: api.project.create.responseSchema },
      },
    },
    (request, reply) =>
      prisma.$transaction(async (tx) => {
        const { name } = request.body;
        const created = await tx.project.create({
          data: { name, stage: 'init' },
        });
        reply.code(201);
        return created;
      }),
  );

  app.post(
    api.project.rename.route,
    {
      schema: {
        params: api.project.rename.paramsSchema,
        body: api.project.rename.requestSchema,
        response: {
          200: api.project.rename.responseSchema,
          404: api.common.error.responseSchema,
        },
      },
    },
    (request, reply) =>
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
        reply.code(200);
        return {
          ...updated,
          previewId: updated.preview?.id,
        };
      }),
  );

  app.delete(
    api.project.remove.route,
    {
      schema: { params: api.project.remove.paramsSchema },
    },
    (request, reply) =>
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
        reply.code(204);
        return;
      }),
  );
};
