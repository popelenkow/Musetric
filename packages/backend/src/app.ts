import { fastify, FastifyInstance } from 'fastify';
import { envs } from './common/envs';
import { logger } from './common/logger';
import { getHttps } from './common/pems';
import { registerRouters } from './routers';
import { registerBlobGarbageCollector } from './services/blobGarbageCollector';
import { registerBlobStorage } from './services/blobStorage';
import { registerFrontend } from './services/frontend';
import { registerMultipart } from './services/multipart';
import { registerSchemaCompiler } from './services/schemaCompiler';
import { registerSwagger } from './services/swagger';

export const createServerApp = (): FastifyInstance => {
  const app: FastifyInstance = fastify({
    logger,
    // eslint-disable-next-line no-restricted-syntax
    https: envs.protocol === 'https' ? getHttps() : null,
  });
  registerBlobStorage(app);
  registerBlobGarbageCollector(app);
  registerMultipart(app);
  registerSchemaCompiler(app);
  registerSwagger(app);
  registerFrontend(app);
  registerRouters(app);
  return app;
};
