import { FastifyInstance } from 'fastify';
import { previewRouter } from './preview.js';
import { projectRouter } from './project.js';
import { soundRouter } from './sound.js';

export const registerRouters = (app: FastifyInstance) => {
  app.register(previewRouter);
  app.register(projectRouter);
  app.register(soundRouter);
};
