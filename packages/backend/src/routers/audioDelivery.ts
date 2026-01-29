import { api } from '@musetric/api';
import { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import { assertFound } from '../common/assertFound.js';
import { handleCachedFile } from '../common/cachedFile.js';
import { envs } from '../common/envs.js';

export const audioDeliveryRouter: FastifyPluginAsyncZod = async (app) => {
  app.addHook('onRoute', (opts) => {
    if (opts.schema) opts.schema.tags = ['audioDelivery'];
  });

  app.route({
    ...api.audioDelivery.get.route,
    handler: async (request, reply) => {
      const { projectId, type } = request.params;
      const audio = await app.db.audioDelivery.get(projectId, type);
      assertFound(
        audio,
        `Audio delivery for project ${projectId} and type ${type} not found`,
      );

      const project = await app.db.project.get(projectId);
      assertFound(project, `Project with id ${projectId} not found`);

      const data = await app.blobStorage.get(audio.blobId);
      assertFound(data, `Audio delivery blob for id ${audio.blobId} not found`);

      const suffix = `_${type}`;
      const isNotModified = handleCachedFile(request, reply, {
        data,
        filename: `${project.name}${suffix}.${envs.audioDeliveryFormat}`,
        contentType: envs.audioDeliveryContentType,
      });

      if (isNotModified) {
        return;
      }

      return data;
    },
  });

  return Promise.resolve();
};
