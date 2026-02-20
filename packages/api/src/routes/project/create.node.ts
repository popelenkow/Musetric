import { fastifyRoute } from '../common/fastifyRoute.node.js';
import { base } from './create.js';

export * from './create.js';
export const route = fastifyRoute(base);
