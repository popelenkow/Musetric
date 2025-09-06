import { envs } from '../common/envs';
import { Logger, LogLevel, wrapLoggerWithProcessName } from '../common/logger';
import { spawnPython } from '../common/spawnPython';

export type SeparationProgress = {
  stage: string;
  progress: number;
};

export type SeparateAudioResultFile = {
  filename: string;
  contentType: string;
};
export type SeparateAudioResult = {
  vocal: SeparateAudioResultFile;
  instrumental: SeparateAudioResultFile;
};

export type SeparateAudioOptions = {
  inputPath: string;
  vocalPath: string;
  instrumentalPath: string;
  onProgress: (progress: SeparationProgress) => void;
  logger: Logger;
  logLevel: LogLevel;
};

export const separateAudio = async (options: SeparateAudioOptions) => {
  const {
    inputPath,
    vocalPath,
    instrumentalPath,
    onProgress,
    logger,
    logLevel,
  } = options;
  let metadata: SeparateAudioResult | undefined = undefined;

  type ProgressMessage = {
    type: 'progress';
    stage: string;
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
      '--input': inputPath,
      '--vocal-output': vocalPath,
      '--instrumental-output': instrumentalPath,
      '--log-level': logLevel,
    },
    handlers: {
      progress: (message) => {
        onProgress({
          stage: message.stage,
          progress: message.progress,
        });
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
