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
    handler: () => {
      const all = app.db.project.list();
      return all.map((project): api.project.list.Response[number] => ({
        ...project,
        previewUrl: api.preview.get.url(project.preview?.id),
      }));
    },
  });

  app.route({
    ...api.project.get.route,
    handler: (request) => {
      const { projectId } = request.params;
      const found = app.db.project.get(projectId);
      assertFound(found, `Project with id ${projectId} not found`);
      const result: api.project.get.Response = {
        ...found,
        previewUrl: api.preview.get.url(found.preview?.id),
      };
      return result;
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

      const created = app.db.project.create({
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

      const updated = app.db.project.update({
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
    handler: (request) => {
      const { projectId } = request.params;
      const isRemoved = app.db.project.remove(projectId);
      assertFound(
        isRemoved || undefined,
        `Project with id ${projectId} not found`,
      );
    },
  });

  return Promise.resolve();
};
