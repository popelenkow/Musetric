import { CreateMusetricApp } from './types';

declare const createMusetricApp: CreateMusetricApp;
createMusetricApp('root').finally(() => {});
