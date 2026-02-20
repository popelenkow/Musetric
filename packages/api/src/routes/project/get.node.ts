import { fastifyRoute } from '../common/fastifyRoute.node.js';
import { base } from './get.js';

export * from './get.js';
export const route = fastifyRoute(base);
