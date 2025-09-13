import { fastifyMultipart } from '@fastify/multipart';
import { fastifyStatic } from '@fastify/static';
import { createBlobGarbageCollector } from '@musetric/resource-utils/blobGarbageCollector';
import {
  BlobStorage,
  createBlobStorage,
} from '@musetric/resource-utils/blobStorage';
import { fastify, FastifyInstance } from 'fastify';
import {
  serializerCompiler,
  validatorCompiler,
} from 'fastify-type-provider-zod';
import { killDevHost } from './common/dev';
import { envs } from './common/envs';
import { logger } from './common/logger';
import { getHttps } from './common/pems';
import { prisma } from './common/prisma';
import { registerSwagger } from './common/swagger';
import { registerRouters } from './routers';

// https://github.com/fastify/fastify-multipart/issues/574
declare module '@fastify/multipart' {
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
  interface MultipartFile {
    value: File;
  }
}
declare module 'fastify' {
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
  interface FastifyInstance {
    blobStorage: BlobStorage;
  }
}

export const startServer = async (): Promise<void> => {
  const app: FastifyInstance = fastify({
    logger,
    // eslint-disable-next-line no-restricted-syntax
    https: envs.protocol === 'https' ? getHttps() : null,
  });

  const blobStorage = createBlobStorage(envs.blobsPath);

  const blobGC = createBlobGarbageCollector({
    blobStorage,
    gcIntervalMs: envs.gcIntervalMs,
    blobRetentionMs: envs.blobRetentionMs,
    getReferencedBlobIds: async (): Promise<string[]> => {
      const [sounds, previews] = await Promise.all([
        prisma.sound.findMany({ select: { blobId: true } }),
        prisma.preview.findMany({ select: { blobId: true } }),
      ]);

      return [
        ...sounds.map((sound) => sound.blobId),
        ...previews.map((preview) => preview.blobId),
      ];
    },
  });
  app.decorate('blobStorage', blobStorage);

  app.addHook('onReady', () => {
    blobGC.start();
  });

  app.addHook('onClose', () => {
    blobGC.stop();
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
    root: envs.publicPath,
    prefix: '/',
    index: ['index.html'],
  });
  app.setNotFoundHandler((request, reply) => {
    if (request.raw.method === 'GET') {
      return reply.sendFile('index.html');
    }
    return reply.callNotFound();
  });
  await registerSwagger(app, envs.version);
  app.setValidatorCompiler(validatorCompiler);
  app.setSerializerCompiler(serializerCompiler);
  registerRouters(app);
  try {
    await app.listen({
      port: envs.port,
      host: envs.host,
      listenTextResolver: (rawAddress) => {
        const address = rawAddress.replace('127.0.0.1', 'localhost');
        return `Server: ${address}\tSwagger: ${address}/docs`;
      },
    });
  } catch (error) {
    if (error instanceof Error && error.message.includes('EADDRINUSE')) {
      console.error(`Port ${envs.port} is already in use`);
      killDevHost();
      process.exit(1);
    }
    throw error;
  }
};

startServer().catch((error) => {
  console.error(error);
  process.exit(1);
});
