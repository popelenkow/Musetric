import { DB } from '@musetric/backend-db';
import { FastifyInstance } from 'fastify';
import { envs } from '../common/envs.js';

declare module 'fastify' {
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
  interface FastifyInstance {
    db: DB.Instance;
  }
}

export const registerDb = (app: FastifyInstance) => {
  const db = DB.createInstance(envs.databasePath);
  app.addHook('onClose', () => {
    db.disconnect();
  });
  app.decorate('db', db);
};
