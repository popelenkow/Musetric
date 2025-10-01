import { fastifyStatic } from '@fastify/static';
import { FastifyInstance, FastifyRequest } from 'fastify';
import { envs } from '../common/envs.js';

const isApiPath = (path: string) =>
  path.startsWith('/api') ||
  path.startsWith('/docs') ||
  path.startsWith('/swagger');

const isFrontendRequest = (request: FastifyRequest) => {
  const method = request.raw.method ?? 'GET';
  const pathname = String(request.raw.url ?? '/').split('?')[0];
  const isGet = method === 'GET' || method === 'HEAD';
  const isAsset = pathname.includes('.');
  const isApi = isApiPath(pathname);
  return isGet && !isAsset && !isApi;
};

export const registerFrontend = (app: FastifyInstance) => {
  app.register(fastifyStatic, {
    root: envs.publicPath,
    prefix: '/',
    index: ['index.html'],
  });
  app.setNotFoundHandler((request, reply) => {
    if (isFrontendRequest(request)) {
      reply.sendFile('index.html');
    }
    return reply.callNotFound();
  });
};
