import { api } from '@musetric/api';
import { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import { assertFound } from '../common/assertFound';
import { handleCachedFile } from '../common/cachedFile';
import { prisma } from '../common/prisma';

export const soundRouter: FastifyPluginAsyncZod = async (app) => {
  app.addHook('onRoute', (opts) => {
    if (opts.schema) opts.schema.tags = ['sound'];
  });

  app.route({
    ...api.sound.get.route,
    handler: async (request, reply) =>
      prisma.$transaction(async (tx) => {
        const { projectId, type } = request.params;
        const sound = await tx.sound.findFirst({
          where: { projectId, type },
        });
        assertFound(
          sound,
          `Sound for project ${projectId} and type ${type} not found`,
        );

        const isNotModified = handleCachedFile(request, reply, {
          data: sound.data,
          filename: sound.filename,
          contentType: sound.contentType,
        });

        if (isNotModified) {
          return;
        }

        return sound.data;
      }),
  });

  return Promise.resolve();
};
