import { FastifyInstance } from 'fastify';
import { createSeparationWorker, SeparationWorker } from '../common/separationWorker';

declare module 'fastify' {
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
  interface FastifyInstance {
    separationWorker: SeparationWorker;
  }
}

export const registerSeparationWorker = (app: FastifyInstance) => {
  const separationWorker = createSeparationWorker(
    app.db,
    app.blobStorage,
    app.log,
  );
  app.addHook('onReady', () => {
    separationWorker.start();
  });
  app.addHook('onClose', () => {
    separationWorker.stop();
  });
  app.decorate('separationWorker', separationWorker);
};
