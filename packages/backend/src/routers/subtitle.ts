import { api } from '@musetric/api';
import { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import { z } from 'zod';
import { assertFound } from '../common/assertFound.js';

export const subtitleRouter: FastifyPluginAsyncZod = async (app) => {
  app.addHook('onRoute', (opts) => {
    if (opts.schema) opts.schema.tags = ['subtitle'];
  });

  app.route({
    ...api.subtitle.get.route,
    handler: async (request) => {
      const { projectId } = request.params;

      const subtitle = await app.db.subtitle.getByProject(projectId);
      assertFound(subtitle, `Subtitle for project ${projectId} not found`);

      const data = await app.blobStorage.get(subtitle.blobId);
      assertFound(data, `Subtitle blob for project ${projectId} not found`);

      const raw = JSON.parse(data.toString('utf-8'));
      const segments = z.array(api.subtitle.segmentSchema).parse(raw);

      return segments;
    },
  });

  return Promise.resolve();
};
