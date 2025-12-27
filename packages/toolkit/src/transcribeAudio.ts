import { Logger, LogLevel } from '@musetric/resource-utils/logger';
import { spawnScript } from '@musetric/resource-utils/spawnScript/index';

export type TranscribeAudioOptions = {
  sourcePath: string;
  resultPath: string;
  onProgress?: (transcriptionProgress: number) => void;
  logger: Logger;
  logLevel: LogLevel;
};

export const transcribeAudio = async (
  options: TranscribeAudioOptions,
): Promise<void> => {
  const { sourcePath, resultPath, onProgress, logger, logLevel } = options;

  type ProgressMessage = {
    type: 'progress';
    progress: number;
  };

  await spawnScript<ProgressMessage>({
    command: 'musetric-transcribe',
    args: {
      '--audio-path': sourcePath,
      '--result-path': resultPath,
      '--log-level': logLevel,
    },
    cwd: process.cwd(),
    handlers: {
      progress: (message) => {
        onProgress?.(message.progress);
      },
    },
    logger,
    processName: 'transcribeAudio',
  });
};
