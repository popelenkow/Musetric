import { ServerOptions } from 'node:https';
import { generate } from 'selfsigned';

const pems = generate([{ name: 'commonName', value: 'localhost' }], {
  keySize: 2048,
  days: 365,
  extensions: [{ name: 'basicConstraints', cA: true }],
});

export const getHttps = (): ServerOptions => ({
  key: pems.private,
  cert: pems.cert,
});
