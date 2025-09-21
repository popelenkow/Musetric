import { FastifyInstance } from 'fastify';
import { DB } from '../common/db';

declare module 'fastify' {
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
  interface FastifyInstance {
    db: DB.Instance;
  }
}

export const registerDb = (app: FastifyInstance) => {
  const db = DB.create();
  app.addHook('onClose', async () => {
    await db.disconnect();
  });
  app.decorate('db', db);
};
