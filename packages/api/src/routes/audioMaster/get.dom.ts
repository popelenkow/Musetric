import { axiosRequest } from '../common/axiosRequest.dom.js';
import { base } from './get.js';

export * from './get.js';
export const request = axiosRequest(base);
