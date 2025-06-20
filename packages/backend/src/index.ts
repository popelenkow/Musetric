import path from 'node:path';
import { fastifyMultipart } from '@fastify/multipart';
import { fastifyStatic } from '@fastify/static';
import {
  serializerCompiler,
  validatorCompiler,
} from '@musetric/fastify-type-provider-zod';
import { fastify, FastifyInstance } from 'fastify';
import { envs } from './common/envs';
import { logger } from './common/logger';
import { registerSwagger } from './common/swagger';
import { registerRouters } from './routers';

// https://github.com/fastify/fastify-multipart/issues/574
declare module '@fastify/multipart' {
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
  interface MultipartFile {
    value: File;
  }
}

export const startServer = async () => {
  try {
    const app: FastifyInstance = fastify({
      logger,
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
    registerRouters(app);
    await app.listen({
      port: envs.port,
      host: envs.host,
      listenTextResolver: (rawAddress: string) => {
        const address = rawAddress.replace('127.0.0.1', 'localhost');
        return `Server: ${address}\tSwagger: ${address}/docs`;
      },
    });
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};
startServer();
