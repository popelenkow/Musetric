import { Logger } from '@musetric/resource-utils/logger';
import { spawnScript } from '@musetric/resource-utils/spawnScript/index';

export type SeparateAudioOptions = {
  sourcePath: string;
  vocalPath: string;
  instrumentalPath: string;
  sampleRate: number;
  outputFormat: string;
  onProgress: (separationProgress: number) => void;
  logger: Logger;
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
      '--log-level': logger.level ?? 'info',
    },
    cwd: process.cwd(),
    handlers: {
      progress: (message) => {
        onProgress(message.progress);
      },
    },
    logger,
    processName: 'separateAudio',
  });
};
