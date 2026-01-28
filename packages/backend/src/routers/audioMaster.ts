import { api } from '@musetric/api';
import { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import { assertFound } from '../common/assertFound.js';
import { handleCachedFile } from '../common/cachedFile.js';
import { envs } from '../common/envs.js';

export const audioMasterRouter: FastifyPluginAsyncZod = async (app) => {
  app.addHook('onRoute', (opts) => {
    if (opts.schema) opts.schema.tags = ['audio'];
  });

  app.route({
    ...api.audioMaster.get.route,
    handler: async (request, reply) => {
      const { projectId, type } = request.params;
      const audio = await app.db.audioMaster.get(projectId, type);
      assertFound(
        audio,
        `Audio for project ${projectId} and type ${type} not found`,
      );

      const project = await app.db.project.get(projectId);
      assertFound(project, `Project with id ${projectId} not found`);

      const data = await app.blobStorage.get(audio.blobId);
      assertFound(data, `Audio blob for id ${audio.blobId} not found`);

      const suffix = type === 'source' ? '' : `_${type}`;
      const isNotModified = handleCachedFile(request, reply, {
        data,
        filename: `${project.name}${suffix}.${envs.audioFormat}`,
        contentType: envs.audioContentType,
      });

      if (isNotModified) {
        return;
      }

      return data;
    },
  });

  return Promise.resolve();
};
