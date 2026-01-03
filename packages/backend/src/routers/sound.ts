import { api } from '@musetric/api';
import { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import { assertFound } from '../common/assertFound.js';
import { handleCachedFile } from '../common/cachedFile.js';

export const soundRouter: FastifyPluginAsyncZod = async (app) => {
  app.addHook('onRoute', (opts) => {
    if (opts.schema) opts.schema.tags = ['sound'];
  });

  app.route({
    ...api.sound.get.route,
    handler: async (request, reply) => {
      const { projectId, type } = request.params;
      const sound = await app.db.sound.get(projectId, type);
      assertFound(
        sound,
        `Sound for project ${projectId} and type ${type} not found`,
      );

      const data = await app.blobStorage.get(sound.blobId);
      assertFound(data, `Sound blob for id ${sound.blobId} not found`);

      const isNotModified = handleCachedFile(request, reply, {
        data,
        filename: sound.filename,
        contentType: sound.contentType,
      });

      if (isNotModified) {
        return;
      }

      return data;
    },
  });

  return Promise.resolve();
};
