import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  Logger,
  LogLevel,
  wrapLoggerWithProcessName,
} from '../common/logger.js';
import { spawnPython } from '../common/spawnPython/index.js';

export type SeparateAudioResult = {
  vocal: string;
  instrumental: string;
};

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
  let result: SeparateAudioResult | undefined = undefined;

  type ProgressMessage = {
    type: 'progress';
    progress: number;
  };

  type ResultMessage = {
    type: 'result';
    vocal: string;
    instrumental: string;
  };

  type WorkerMessage = ProgressMessage | ResultMessage;

  return spawnPython<SeparateAudioResult, WorkerMessage>({
    scriptPath: join(dirname(fileURLToPath(import.meta.url)), 'index.py'),
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
      result: (message) => {
        result = {
          vocal: message.vocal,
          instrumental: message.instrumental,
        };
      },
    },
    onFinish: (code) => {
      if (code !== 0) {
        throw new Error(`Python script failed with code ${code}`);
      }

      if (result === undefined) {
        throw new Error(`No result message received from Python script`);
      }

      return result;
    },
    logger: wrapLoggerWithProcessName(logger, 'separateAudio'),
  });
};
