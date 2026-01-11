import { Logger } from '@musetric/resource-utils/logger';
import {
  spawnScript,
  type SpawnScriptHandlers,
} from '@musetric/resource-utils/spawnScript/index';

export type TranscribeAudioMessage =
  | {
      type: 'progress';
      progress: number;
    }
  | {
      type: 'download';
      label: string;
      file?: string;
      downloaded: number;
      total?: number;
      status?: 'active' | 'cached' | 'done';
    };

export type TranscribeAudioOptions = {
  sourcePath: string;
  resultPath: string;
  handlers: SpawnScriptHandlers<TranscribeAudioMessage>;
  logger: Logger;
};

export const transcribeAudio = async (
  options: TranscribeAudioOptions,
): Promise<void> => {
  const { sourcePath, resultPath, handlers, logger } = options;

  await spawnScript<TranscribeAudioMessage>({
    command: 'musetric-transcribe',
    args: {
      '--audio-path': sourcePath,
      '--result-path': resultPath,
      '--log-level': logger.level ?? 'info',
    },
    cwd: process.cwd(),
    handlers,
    logger,
    processName: 'transcribeAudio',
  });
};
