import { ServerOptions } from 'node:https';
import { generate } from 'selfsigned';
import { envs } from './envs';

const pems = generate([{ name: 'commonName', value: 'localhost' }], {
  keySize: 2048,
  days: 365,
  extensions: [{ name: 'basicConstraints', cA: true }],
});

export const getHttps = (): ServerOptions | null => {
  if (envs.protocol !== 'https') {
    return null;
  }
  return {
    key: pems.private,
    cert: pems.cert,
  };
};
