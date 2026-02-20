import { fastifyRoute } from '../common/fastifyRoute.node.js';
import { base } from './status.js';

export * from './status.js';
export const route = fastifyRoute(base);
