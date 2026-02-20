import { fastifyRoute } from '../common/fastifyRoute.node.js';
import { base } from './list.js';

export * from './list.js';
export const route = fastifyRoute(base);
