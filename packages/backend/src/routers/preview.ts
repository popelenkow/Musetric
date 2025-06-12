import crypto from 'crypto';
import { api } from '@musetric/api';
import { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
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

        if (!preview) {
          reply.code(404);
          return { message: `Preview with id ${previewId} not found` };
        }

        const etag = crypto
          .createHash('md5')
          .update(preview.data)
          .digest('hex');

        reply.headers({
          'content-type': preview.contentType,
          'content-disposition': `attachment; filename*=UTF-8''${encodeURIComponent(preview.filename)}`,
          'cache-control': 'public, max-age=86400',
          etag,
        });

        if (request.headers['if-none-match'] === etag) {
          reply.code(304);
          return;
        }

        return preview.data;
      }),
  });
};
