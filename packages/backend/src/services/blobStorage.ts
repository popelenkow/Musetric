import {
  BlobStorage,
  createBlobStorage,
} from '@musetric/resource-utils/blobStorage';
import { FastifyInstance } from 'fastify';
import { envs } from '../common/envs.js';

declare module 'fastify' {
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
  interface FastifyInstance {
    blobStorage: BlobStorage;
  }
}

export const registerBlobStorage = (app: FastifyInstance) => {
  const blobStorage = createBlobStorage(envs.blobsPath);
  app.decorate('blobStorage', blobStorage);
};
