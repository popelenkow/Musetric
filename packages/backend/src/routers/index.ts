import { FastifyInstance } from 'fastify';
import { audioMasterRouter } from './audioMaster.js';
import { previewRouter } from './preview.js';
import { projectRouter } from './project.js';
import { subtitleRouter } from './subtitle.js';

export const registerRouters = (app: FastifyInstance) => {
  app.register(audioMasterRouter);
  app.register(previewRouter);
  app.register(projectRouter);
  app.register(subtitleRouter);
};
