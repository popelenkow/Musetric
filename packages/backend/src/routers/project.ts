import { api } from '@musetric/api';
import { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import { assertFound } from '../common/assertFound';
import { prisma } from '../common/prisma';

export const projectRouter: FastifyPluginAsyncZod = async (app) => {
  app.addHook('onRoute', (routeOptions) => {
    if (routeOptions.schema) {
      routeOptions.schema.tags = ['project'];
    }
  });

  app.route({
    ...api.project.list.route,
    handler: async () => {
      const all = await prisma.project.findMany({
        orderBy: { id: 'desc' },
        include: { preview: true },
      });
      return all.map((project): api.project.list.Response[number] => ({
        ...project,
        previewUrl: api.preview.get.url(project.preview?.id),
      }));
    },
  });

  app.route({
    ...api.project.get.route,
    handler: async (request) => {
      const { projectId } = request.params;
      const found = await prisma.project.findUnique({
        where: { id: projectId },
        include: { preview: true },
      });
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

      return await prisma.$transaction(
        async (tx): Promise<api.project.create.Response> => {
          const created = await tx.project.create({
            data: { name, stage: 'init' },
          });
          const projectId = created.id;

          await tx.sound.create({
            data: {
              projectId,
              blobId: blobSong.blobId,
              filename: blobSong.filename,
              contentType: blobSong.contentType,
              type: 'original',
            },
          });

          const createdPreview = blobPreview
            ? await tx.preview.create({
                data: {
                  projectId,
                  blobId: blobPreview.blobId,
                  filename: blobPreview.filename,
                  contentType: blobPreview.contentType,
                },
              })
            : undefined;

          return {
            ...created,
            previewUrl: api.preview.get.url(createdPreview?.id),
          };
        },
      );
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

      return await prisma.$transaction(
        async (tx): Promise<api.project.edit.Response> => {
          const existing = await tx.project.findUnique({
            where: { id: projectId },
            include: { preview: true },
          });
          assertFound(existing, `Project with id ${projectId} not found`);

          const updated = name
            ? await tx.project.update({
                where: { id: projectId },
                data: { name },
              })
            : existing;

          if (existing.preview && (blobPreview || withoutPreview)) {
            await tx.preview.delete({
              where: { projectId },
            });
          }

          const oldPreview = withoutPreview ? undefined : existing.preview;
          const updatedPreview = blobPreview
            ? await tx.preview.create({
                data: {
                  projectId,
                  blobId: blobPreview.blobId,
                  filename: blobPreview.filename,
                  contentType: blobPreview.contentType,
                },
              })
            : oldPreview;

          return {
            ...updated,
            previewUrl: api.preview.get.url(updatedPreview?.id),
          };
        },
      );
    },
  });

  app.route({
    ...api.project.remove.route,
    handler: async (request) => {
      const { projectId } = request.params;
      const { count } = await prisma.project.deleteMany({
        where: { id: projectId },
      });
      assertFound(count || undefined, `Project with id ${projectId} not found`);
    },
  });

  return Promise.resolve();
};
