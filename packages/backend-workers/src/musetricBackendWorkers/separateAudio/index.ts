import { envs } from '../common/envs.js';
import {
  Logger,
  LogLevel,
  wrapLoggerWithProcessName,
} from '../common/logger.js';
import { spawnPython } from '../common/spawnPython/index.js';

export type SeparateAudioResultFile = {
  filename: string;
  contentType: string;
};
export type SeparateAudioResult = {
  vocal: SeparateAudioResultFile;
  instrumental: SeparateAudioResultFile;
};

export type SeparateAudioOptions = {
  sourcePath: string;
  vocalPath: string;
  instrumentalPath: string;
  onProgress: (progress: number) => void;
  logger: Logger;
  logLevel: LogLevel;
};

export const separateAudio = async (options: SeparateAudioOptions) => {
  const {
    sourcePath,
    vocalPath,
    instrumentalPath,
    onProgress,
    logger,
    logLevel,
  } = options;
  let metadata: SeparateAudioResult | undefined = undefined;

  type ProgressMessage = {
    type: 'progress';
    progress: number;
  };

  type MetadataMessage = {
    type: 'metadata';
    vocal: {
      filename: string;
      contentType: string;
    };
    instrumental: {
      filename: string;
      contentType: string;
    };
  };

  type WorkerMessage = ProgressMessage | MetadataMessage;

  return spawnPython<SeparateAudioResult, WorkerMessage>({
    scriptPath: envs.separateScriptPath,
    args: {
      '--source-path': sourcePath,
      '--vocal-path': vocalPath,
      '--instrumental-path': instrumentalPath,
      '--log-level': logLevel,
    },
    handlers: {
      progress: (message) => {
        onProgress(message.progress);
      },
      metadata: (message) => {
        metadata = {
          vocal: message.vocal,
          instrumental: message.instrumental,
        };
      },
    },
    onFinish: (code) => {
      if (code !== 0) {
        throw new Error(`Python script failed with code ${code}`);
      }

      if (metadata === undefined) {
        throw new Error(`No metadata received from Python script`);
      }

      return metadata;
    },
    logger: wrapLoggerWithProcessName(logger, 'separateAudio'),
  });
};
