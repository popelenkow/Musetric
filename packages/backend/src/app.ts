import { fastify, FastifyInstance } from 'fastify';
import { FastifySSEPlugin } from 'fastify-sse-v2';
import { registerRouters } from './routers/index.js';
import {
  disableRequestLogging,
  registerApiLogger,
} from './services/apiLogger.js';
import { registerBlobGarbageCollector } from './services/blobGarbageCollector.js';
import { registerBlobStorage } from './services/blobStorage.js';
import { registerDb } from './services/db.js';
import { registerFrontend } from './services/frontend.js';
import { https } from './services/https.js';
import { logger } from './services/logger.js';
import { registerMultipart } from './services/multipart.js';
import { registerSchemaCompiler } from './services/schemaCompiler.js';
import { registerSeparationWorker } from './services/separationWorker.js';
import { registerSwagger } from './services/swagger.js';

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
  registerSeparationWorker(app);
  registerMultipart(app);
  app.register(FastifySSEPlugin);
  registerSchemaCompiler(app);
  registerSwagger(app);
  registerFrontend(app);
  registerRouters(app);
  return app;
};
