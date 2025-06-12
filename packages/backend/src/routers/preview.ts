import { api } from '@musetric/api';
import { FastifyPluginAsyncZod } from '@musetric/fastify-type-provider-zod';
import { prisma } from '../common/prisma';

export const previewRouter: FastifyPluginAsyncZod = async (app) => {
  app.addHook('onRoute', (routeOptions) => {
    if (routeOptions.schema) {
      routeOptions.schema.tags = ['preview'];
    }
  });

  app.route({
    ...api.preview.get.route,
    handler: (request, reply) =>
      prisma.$transaction(async (tx) => {
        const { previewId } = request.params;

        const preview = await tx.preview.findUnique({
          where: { id: previewId },
        });

        if (!preview) {
          reply.code(404);
          return { message: `Preview with id ${previewId} not found` };
        }

        reply.header('Content-Type', preview.contentType);
        reply.header(
          'Content-Disposition',
          `attachment; filename="${preview.filename}"`,
        );

        // eslint-disable-next-line
        return preview.data as any;
      }),
  });

  app.route({
    ...api.preview.upload.route,
    handler: (request, reply) =>
      prisma.$transaction(async (tx) => {
        const { projectId } = request.params;
        const { file } = request.body;

        const project = await tx.project.findUnique({
          where: { id: projectId },
        });

        if (!project) {
          reply.code(404);
          return { message: `Project with id ${projectId} not found` };
        }

        if (!file) {
          reply.code(400);
          return { message: 'No file was uploaded' };
        }

        const existingPreview = await tx.preview.findFirst({
          where: { projectId },
        });
        if (existingPreview) {
          await tx.preview.delete({
            where: { id: existingPreview.id },
          });
        }

        const arrayBuffer = await file.arrayBuffer();
        const data = Buffer.from(arrayBuffer);
        const preview = await tx.preview.create({
          data: {
            projectId,
            data,
            filename: file.name,
            contentType: file.type,
          },
        });

        return { id: preview.id };
      }),
  });
};
