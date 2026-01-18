import { Logger } from '@musetric/resource-utils/logger';
import {
  spawnScript,
  type SpawnScriptHandlers,
} from '@musetric/resource-utils/spawnScript/index';

export type SeparateAudioMessage =
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
      status?: 'processing' | 'cached' | 'done';
    };

export type SeparateAudioOptions = {
  sourcePath: string;
  leadPath: string;
  backingPath: string;
  instrumentalPath: string;
  sampleRate: number;
  outputFormat: string;
  handlers: SpawnScriptHandlers<SeparateAudioMessage>;
  logger: Logger;
  modelsPath?: string;
};

export const separateAudio = async (options: SeparateAudioOptions) => {
  const {
    sourcePath,
    leadPath,
    backingPath,
    instrumentalPath,
    sampleRate,
    outputFormat,
    handlers,
    logger,
    modelsPath,
  } = options;

  await spawnScript<SeparateAudioMessage>({
    command: 'musetric-separate',
    args: {
      '--source-path': sourcePath,
      '--lead-path': leadPath,
      '--backing-path': backingPath,
      '--instrumental-path': instrumentalPath,
      '--sample-rate': sampleRate.toString(),
      '--output-format': outputFormat,
      '--log-level': logger.level ?? 'info',
    },
    cwd: process.cwd(),
    handlers,
    logger,
    processName: 'separateAudio',
    env: modelsPath
      ? {
          // eslint-disable-next-line no-restricted-syntax
          HF_HUB_CACHE: modelsPath,
        }
      : undefined,
  });
};
