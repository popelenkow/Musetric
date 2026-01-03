import { api } from '@musetric/api';
import { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import { assertFound } from '../common/assertFound.js';

export const projectRouter: FastifyPluginAsyncZod = async (app) => {
  app.addHook('onRoute', (routeOptions) => {
    if (routeOptions.schema) {
      routeOptions.schema.tags = ['project'];
    }
  });

  app.route({
    ...api.project.list.route,
    handler: async () => {
      const all = await app.db.project.list();
      return all.map((project): api.project.list.Response[number] => {
        const processing = app.processingWorker.getProcessingState(project.id);
        let result: api.project.list.Response[number] = {
          ...project,
          previewUrl: api.preview.get.url(project.preview?.id),
        };
        if (processing) {
          result = {
            ...result,
            stage: processing.stage,
            progress: processing.progress,
          };
        }
        return result;
      });
    },
  });

  app.route({
    ...api.project.get.route,
    handler: async (request) => {
      const { projectId } = request.params;
      const found = await app.db.project.get(projectId);
      assertFound(found, `Project with id ${projectId} not found`);
      const processing = app.processingWorker.getProcessingState(projectId);
      let result: api.project.list.Response[number] = {
        ...found,
        previewUrl: api.preview.get.url(found.preview?.id),
      };
      if (processing) {
        result = {
          ...result,
          stage: processing.stage,
          progress: processing.progress,
        };
        return result;
      }
      return result;
    },
  });

  app.route({
    ...api.project.status.route,
    handler: (request, reply) => {
      const unsubscribe = app.processingWorker.emitter.subscribe((event) => {
        reply.sse({ data: api.project.status.event.stringify(event) });
      });
      const heartbeat = setInterval(() => {
        reply.sse({ event: 'ping' });
      }, 30_000);

      request.socket.on('close', () => {
        clearInterval(heartbeat);
        unsubscribe();
      });

      reply.sse({ comment: 'connected' });
    },
  });

  app.route({
    ...api.project.create.route,
    handler: async (request) => {
      const { song, name, preview } = request.body;

      const blobSong = await app.blobStorage.addFile(song);
      const blobPreview = preview
        ? await app.blobStorage.addFile(preview)
        : undefined;

      const created = await app.db.project.create({
        name,
        song: blobSong,
        preview: blobPreview,
      });

      const result: api.project.create.Response = {
        ...created.project,
        previewUrl: api.preview.get.url(created.preview?.id),
      };

      return result;
    },
  });

  app.route({
    ...api.project.edit.route,
    handler: async (request) => {
      const { projectId } = request.params;
      const { name, preview, withoutPreview } = request.body;

      const blobPreview = preview
        ? await app.blobStorage.addFile(preview)
        : undefined;

      const updated = await app.db.project.update({
        projectId,
        name,
        preview: blobPreview,
        withoutPreview,
      });

      assertFound(updated, `Project with id ${projectId} not found`);

      const result: api.project.edit.Response = {
        ...updated.project,
        previewUrl: api.preview.get.url(updated.preview?.id),
      };

      return result;
    },
  });

  app.route({
    ...api.project.remove.route,
    handler: async (request, reply) => {
      const { projectId } = request.params;
      const isRemoved = await app.db.project.remove(projectId);
      assertFound(
        isRemoved || undefined,
        `Project with id ${projectId} not found`,
      );
      reply.status(200).send();
    },
  });

  return Promise.resolve();
};
