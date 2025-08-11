import { api } from '@musetric/api';
import { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import { assertFound } from '../common/assertFound';
import { handleCachedFile } from '../common/cachedFile';
import { prisma } from '../common/prisma';

export const previewRouter: FastifyPluginAsyncZod = async (app) => {
  app.addHook('onRoute', (opts) => {
    if (opts.schema) opts.schema.tags = ['preview'];
  });

  app.route({
    ...api.preview.get.route,
    handler: (request, reply) =>
      prisma.$transaction(async (tx) => {
        const { previewId } = request.params;
        const preview = await tx.preview.findUnique({
          where: { id: previewId },
        });
        assertFound(preview, `Preview with id ${previewId} not found`);

        const isNotModified = handleCachedFile(request, reply, {
          data: preview.data,
          filename: preview.filename,
          contentType: preview.contentType,
        });

        if (isNotModified) {
          return;
        }

        return preview.data;
      }),
  });
};
