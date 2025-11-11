import { Logger, LogLevel } from '@musetric/resource-utils/logger';
import { spawnScript } from '@musetric/resource-utils/spawnScript/index';

export const separationProcessName = 'separateAudio';

export type SeparateAudioOptions = {
  sourcePath: string;
  vocalPath: string;
  instrumentalPath: string;
  sampleRate: number;
  outputFormat: string;
  onProgress: (separationProgress: number) => void;
  logger: Logger;
  logLevel: LogLevel;
};
export const separateAudio = async (options: SeparateAudioOptions) => {
  const {
    sourcePath,
    vocalPath,
    instrumentalPath,
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
  await spawnScript<ProgressMessage>({
    command: 'musetric-separate',
    args: {
      '--source-path': sourcePath,
      '--vocal-path': vocalPath,
      '--instrumental-path': instrumentalPath,
      '--sample-rate': sampleRate.toString(),
      '--output-format': outputFormat,
      '--log-level': logLevel,
    },
    cwd: process.cwd(),
    handlers: {
      progress: (message) => {
        onProgress(message.progress);
      },
    },
    logger,
    processName: separationProcessName,
  });
};
