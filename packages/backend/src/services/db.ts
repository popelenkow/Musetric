import { DB } from '@musetric/backend-db';
import { type FastifyInstance } from 'fastify';
import { envs } from '../common/envs.js';

declare module 'fastify' {
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
  interface FastifyInstance {
    db: DB.Instance;
  }
}

export const registerDb = async (app: FastifyInstance) => {
  const db = await DB.createInstance(envs.databasePath);
  app.addHook('onClose', async () => {
    await db.disconnect();
  });
  app.decorate('db', db);
};
