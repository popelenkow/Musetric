import { join } from 'node:path';
import { Logger, LogLevel } from '@musetric/resource-utils/logger';
import { rootPath } from '../common/rootPath.js';
import { spawnPython } from '../common/spawnPython.js';

export const separationProcessName = 'separateAudio';

export type SeparateAudioOptions = {
  sourcePath: string;
  vocalPath: string;
  instrumentalPath: string;
  modelPath: string;
  modelConfigPath: string;
  sampleRate: number;
  outputFormat: string;
  onProgress: (progress: number) => void;
  logger: Logger;
  logLevel: LogLevel;
};
export const separateAudio = async (options: SeparateAudioOptions) => {
  const {
    sourcePath,
    vocalPath,
    instrumentalPath,
    modelPath,
    modelConfigPath,
    sampleRate,
    outputFormat,
    onProgress,
    logger,
    logLevel,
  } = options;

  type ProgressMessage = {
    type: 'progress';
    progress: number;
  };
  await spawnPython<ProgressMessage>({
    scriptPath: join(rootPath, 'musetricBackendWorkers/separateAudio/index.py'),
    args: {
      '--source-path': sourcePath,
      '--vocal-path': vocalPath,
      '--instrumental-path': instrumentalPath,
      '--model-path': modelPath,
      '--config-path': modelConfigPath,
      '--sample-rate': sampleRate.toString(),
      '--output-format': outputFormat,
      '--log-level': logLevel,
    },
    handlers: {
      progress: (message) => {
        onProgress(message.progress);
      },
    },
    logger,
    processName: separationProcessName,
  });
};
