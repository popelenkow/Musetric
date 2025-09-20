import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const rootPath = join(dirname(fileURLToPath(import.meta.url)), '../../');

const getLogLevel = () => {
  const envLogLevel = process.env.LOG_LEVEL;
  if (envLogLevel) {
    return envLogLevel;
  }
  return 'info';
};

export const envs = {
  version: process.env.VERSION ?? '0.1.0',
  host: process.env.HOST ?? '0.0.0.0',
  port: process.env.PORT ? Number(process.env.PORT) : 3000,
  logLevel: getLogLevel(),
  protocol: process.env.PROTOCOL === 'http' ? 'http' : 'https',
  blobsPath: join(rootPath, 'tmp/blobs'),
  publicPath: join(rootPath, 'public'),
  gcIntervalMs: 5 * 60 * 1000,
  blobRetentionMs: 5 * 60 * 1000,
};
