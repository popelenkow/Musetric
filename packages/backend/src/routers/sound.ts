import crypto from 'crypto';
import { api } from '@musetric/api';
import { Prisma } from '@prisma/client';
import { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import { prisma } from '../common/prisma';

export const soundRouter: FastifyPluginAsyncZod = async (app) => {
  app.addHook('onRoute', (opts) => {
    if (opts.schema) opts.schema.tags = ['sound'];
  });

  app.route({
    ...api.sound.get.route,
    handler: (request, reply) =>
      prisma.$transaction(async (tx: Prisma.TransactionClient) => {
        const { projectId, type } = request.params;
        const sound = await tx.sound.findFirst({
          where: { projectId, type },
        });

        if (!sound) {
          reply.code(404);
          return {
            message: `Sound for project ${projectId} with type ${type} not found`,
          };
        }

        const etag = crypto.createHash('md5').update(sound.data).digest('hex');

        reply.headers({
          'content-type': sound.contentType,
          'content-disposition': `attachment; filename*=UTF-8''${encodeURIComponent(sound.filename)}`,
          'cache-control': 'public, max-age=86400',
          etag,
        });

        if (request.headers['if-none-match'] === etag) {
          reply.code(304);
          return;
        }

        return sound.data;
      }),
  });
};
