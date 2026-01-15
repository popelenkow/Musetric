import { FastifyInstance } from 'fastify';
import {
  createProcessingWorker,
  ProcessingWorker,
} from './processingWorker.js';

declare module 'fastify' {
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
  interface FastifyInstance {
    processingWorker: ProcessingWorker;
  }
}

export const registerProcessingWorker = (app: FastifyInstance) => {
  const processingWorker = createProcessingWorker(app);

  app.addHook('onReady', () => {
    processingWorker.start();
  });
  app.addHook('onClose', () => {
    processingWorker.stop();
  });
  app.decorate('processingWorker', processingWorker);
};
