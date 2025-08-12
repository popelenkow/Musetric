import { fastify, FastifyInstance } from 'fastify';
import { registerRouters } from './routers';
import { disableRequestLogging, registerApiLogger } from './services/apiLogger';
import { registerBlobGarbageCollector } from './services/blobGarbageCollector';
import { registerBlobStorage } from './services/blobStorage';
import { registerDb } from './services/db';
import { registerFrontend } from './services/frontend';
import { https } from './services/https';
import { logger } from './services/logger';
import { registerMultipart } from './services/multipart';
import { registerSchemaCompiler } from './services/schemaCompiler';
import { registerSwagger } from './services/swagger';

export const createServerApp = (): FastifyInstance => {
  const app: FastifyInstance = fastify({
    logger,
    disableRequestLogging,
    https,
  });
  registerApiLogger(app);
  registerDb(app);
  registerBlobStorage(app);
  registerBlobGarbageCollector(app);
  registerMultipart(app);
  registerSchemaCompiler(app);
  registerSwagger(app);
  registerFrontend(app);
  registerRouters(app);
  return app;
};
