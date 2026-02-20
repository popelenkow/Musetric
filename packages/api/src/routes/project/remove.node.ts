import { fastifyRoute } from '../common/fastifyRoute.node.js';
import { base } from './remove.js';

export * from './remove.js';
export const route = fastifyRoute(base);
