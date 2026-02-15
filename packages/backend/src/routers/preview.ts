import { api } from '@musetric/api';
import { type FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import { assertFound } from '../common/assertFound.js';
import { handleCachedFile } from '../common/cachedFile.js';

export const previewRouter: FastifyPluginAsyncZod = async (app) => {
  app.addHook('onRoute', (opts) => {
    if (opts.schema) opts.schema.tags = ['preview'];
  });

  app.route({
    ...api.preview.get.route,
    handler: async (request, reply) => {
      const { previewId } = request.params;
      const preview = await app.db.preview.get(previewId);
      assertFound(preview, `Preview with id ${previewId} not found`);

      const stat = await app.blobStorage.getStat(preview.blobId);
      assertFound(stat, `Preview blob for id ${previewId} not found`);

      const isNotModified = handleCachedFile(request, reply, {
        filename: preview.filename,
        contentType: preview.contentType,
        size: stat.size,
        mtimeMs: stat.mtimeMs,
      });

      if (isNotModified) {
        return;
      }

      const stream = app.blobStorage.getStream(preview.blobId);
      return reply.send(stream);
    },
  });

  return Promise.resolve();
};
