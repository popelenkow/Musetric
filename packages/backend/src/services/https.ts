import { ServerOptions } from 'node:https';
import { generate } from 'selfsigned';
import { envs } from '../common/envs';

const pems = generate([{ name: 'commonName', value: 'localhost' }], {
  keySize: 2048,
  days: 365,
  extensions: [{ name: 'basicConstraints', cA: true }],
});

const getHttps = (): ServerOptions => ({
  key: pems.private,
  cert: pems.cert,
});

// eslint-disable-next-line no-restricted-syntax
export const https = envs.protocol === 'https' ? getHttps() : null;
