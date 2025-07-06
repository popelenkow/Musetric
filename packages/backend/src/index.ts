import path from 'node:path';
import { fastifyMultipart } from '@fastify/multipart';
import { fastifyStatic } from '@fastify/static';
import { fastify, FastifyInstance } from 'fastify';
import {
  serializerCompiler,
  validatorCompiler,
} from 'fastify-type-provider-zod';
import { envs } from './common/envs';
import { logger } from './common/logger';
import { getHttps } from './common/pems';
import { registerSwagger } from './common/swagger';
import { registerRouters } from './routers';

// https://github.com/fastify/fastify-multipart/issues/574
declare module '@fastify/multipart' {
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
  interface MultipartFile {
    value: File;
  }
}

export const startServer = async (): Promise<void> => {
  const app: FastifyInstance = fastify({
    logger,
    https: getHttps(),
  });
  app.addHook('onRoute', (routeOptions) => {
    routeOptions.logLevel = 'warn';
  });
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
  app.register(fastifyStatic, {
    root: path.join(__dirname, '../public'),
    prefix: '/',
    index: ['index.html'],
  });
  app.setNotFoundHandler((request, reply) => {
    if (request.raw.method === 'GET') {
      return reply.sendFile('index.html');
    }
    return reply.callNotFound();
  });
  await registerSwagger(app);
  app.setValidatorCompiler(validatorCompiler);
  app.setSerializerCompiler(serializerCompiler);
  await registerRouters(app);
  await app.listen({
    port: envs.port,
    host: envs.host,
    listenTextResolver: (rawAddress) => {
      const address = rawAddress.replace('127.0.0.1', 'localhost');
      return `Server: ${address}\tSwagger: ${address}/docs`;
    },
  });
};

startServer().catch((error) => {
  console.error(error);
  process.exit(1);
});
