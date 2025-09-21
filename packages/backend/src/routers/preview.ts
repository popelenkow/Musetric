import { api } from '@musetric/api';
import { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import { assertFound } from '../common/assertFound';
import { handleCachedFile } from '../common/cachedFile';

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

      const data = await app.blobStorage.get(preview.blobId);
      assertFound(data, `Preview blob for id ${previewId} not found`);

      const isNotModified = handleCachedFile(request, reply, {
        data,
        filename: preview.filename,
        contentType: preview.contentType,
      });

      if (isNotModified) {
        return;
      }

      return data;
    },
  });

  return Promise.resolve();
};
