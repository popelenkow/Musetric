import { fastifyMultipart } from '@fastify/multipart';
import { FastifyInstance } from 'fastify';

// https://github.com/fastify/fastify-multipart/issues/574
declare module '@fastify/multipart' {
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
  interface MultipartFile {
    value: File;
  }
}

export const registerMultipart = (app: FastifyInstance) => {
  app.register(fastifyMultipart, {
    attachFieldsToBody: 'keyValues',
    limits: {
      fileSize: 20 * 1024 * 1024,
    },
    onFile: async (part) => {
      const buff = await part.toBuffer();
      const file = new File([buff], part.filename, {
        type: part.mimetype,
      });
      part.value = file;
    },
  });
};
