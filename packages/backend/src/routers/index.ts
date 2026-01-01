import { FastifyInstance } from 'fastify';
import { previewRouter } from './preview.js';
import { projectRouter } from './project.js';
import { soundRouter } from './sound.js';
import { subtitleRouter } from './subtitle.js';

export const registerRouters = (app: FastifyInstance) => {
  app.register(previewRouter);
  app.register(projectRouter);
  app.register(soundRouter);
  app.register(subtitleRouter);
};
