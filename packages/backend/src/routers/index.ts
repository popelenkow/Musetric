import { FastifyInstance } from 'fastify';
import { previewRouter } from './preview';
import { projectRouter } from './project';
import { soundRouter } from './sound';

export const registerRouters = (app: FastifyInstance) => {
  app.register(previewRouter);
  app.register(projectRouter);
  app.register(soundRouter);
};
