import { fastifyRoute } from '../common/fastifyRoute.node.js';
import { base } from './edit.js';

export * from './edit.js';
export const route = fastifyRoute(base);
