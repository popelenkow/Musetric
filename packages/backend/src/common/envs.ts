import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { isLogLevel, LogLevel } from '@musetric/resource-utils/logger';

const rootPath = join(dirname(fileURLToPath(import.meta.url)), '../../');

const getLogLevel = (): LogLevel => {
  const level = process.env.LOG_LEVEL;
  return isLogLevel(level) ? level : 'info';
};

export const envs = {
  version: process.env.VERSION ?? '0.1.0',
  host: process.env.HOST ?? '0.0.0.0',
  port: process.env.PORT ? Number(process.env.PORT) : 3000,
  logLevel: getLogLevel(),
  protocol: process.env.PROTOCOL === 'http' ? 'http' : 'https',
  blobsPath: join(rootPath, 'storage/blobs'),
  publicPath: join(rootPath, 'storage/public'),
  databasePath: join(rootPath, 'storage/db/app.db'),
  gcIntervalMs: 5 * 60 * 1000,
  blobRetentionMs: 5 * 60 * 1000,
  separationIntervalMs: 10 * 1000,
  modelPath: join(rootPath, 'storage/models/model.ckpt'),
  modelConfigPath: join(rootPath, 'storage/models/model.yaml'),
  audioSampleRate: 44100,
  audioFormat: 'flac',
  audioContentType: 'audio/flac',
};
