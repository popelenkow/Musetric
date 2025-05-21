import { FastifyInstance } from 'fastify';
import { previewRouter } from './preview';
import { projectRouter } from './project';

export const registerRouters = async (app: FastifyInstance) => {
  app.register(previewRouter);
  app.register(projectRouter);
};
