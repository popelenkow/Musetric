import { api } from '@musetric/api';
import { type FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import { assertFound } from '../common/assertFound.js';
import { handleCachedFile } from '../common/cachedFile.js';

export const subtitleRouter: FastifyPluginAsyncZod = async (app) => {
  app.addHook('onRoute', (opts) => {
    if (opts.schema) opts.schema.tags = ['subtitle'];
  });

  app.route({
    ...api.subtitle.get.route,
    handler: async (request, reply) => {
      const { projectId } = request.params;

      const subtitle = await app.db.subtitle.getByProject(projectId);
      assertFound(subtitle, `Subtitle for project ${projectId} not found`);

      const project = await app.db.project.get(projectId);
      assertFound(project, `Project with id ${projectId} not found`);

      const stat = await app.blobStorage.getStat(subtitle.blobId);
      assertFound(stat, `Subtitle blob for project ${projectId} not found`);

      const isNotModified = handleCachedFile(request, reply, {
        filename: `${project.name}_subtitle.json`,
        contentType: 'application/json',
        size: stat.size,
        mtimeMs: stat.mtimeMs,
      });

      if (isNotModified) {
        return;
      }

      const stream = app.blobStorage.getStream(subtitle.blobId);
      return reply.send(stream);
    },
  });

  return Promise.resolve();
};
