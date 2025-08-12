import { basename, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defaultModelConfigUrl, defaultModelUrl } from '@musetric/backend-workers/scripts';
import { isLogLevel, LogLevel } from '@musetric/resource-utils/logger';

const getFileNameFromUrl = (url: string): string => {
  return basename(new URL(url).pathname);
};

const rootPath = join(dirname(fileURLToPath(import.meta.url)), '../../');
const modelsDir = join(rootPath, 'storage', 'models');

const modelFileName = getFileNameFromUrl(defaultModelUrl);
const configFileName = getFileNameFromUrl(defaultModelConfigUrl);

const getLogLevel = (): LogLevel => {
  const envLogLevel = process.env.LOG_LEVEL;
  if (envLogLevel && isLogLevel(envLogLevel)) {
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
  blobsPath: join(rootPath, 'storage/blobs'),
  publicPath: join(rootPath, 'public'),
  databasePath: join(rootPath, 'storage/app.db'),
  gcIntervalMs: 5 * 60 * 1000,
  blobRetentionMs: 5 * 60 * 1000,
  separationIntervalMs: 10 * 1000,
  modelsDir,
  modelPath: join(modelsDir, modelFileName),
  modelConfigPath: join(modelsDir, configFileName),
  sampleRate: 44100,
  outputFormat: 'flac',
  contentType: 'audio/flac',
};
