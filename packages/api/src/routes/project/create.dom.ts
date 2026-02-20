import { axiosRequest } from '../common/axiosRequest.dom.js';
import { base } from './create.js';

export * from './create.js';
export const request = axiosRequest(base);
