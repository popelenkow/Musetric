import { PrismaClient } from '@prisma/client';
import { FastifyInstance } from 'fastify';

declare module 'fastify' {
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
  interface FastifyInstance {
    db: PrismaClient;
  }
}

export const registerDb = (app: FastifyInstance) => {
  const db = new PrismaClient();
  app.decorate('db', db);
};
