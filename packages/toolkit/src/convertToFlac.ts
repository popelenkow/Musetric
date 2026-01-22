import { Logger } from '@musetric/resource-utils/logger';
import { spawnScript } from '@musetric/resource-utils/spawnScript/index';

export type ConvertToFlacOptions = {
  fromPath: string;
  toPath: string;
  sampleRate: number;
  logger: Logger;
};

export type ConvertToFlacMessage = {
  type: 'result';
};

export const convertToFlac = async (
  options: ConvertToFlacOptions,
): Promise<void> => {
  const { fromPath, toPath, sampleRate, logger } = options;

  await spawnScript<ConvertToFlacMessage>({
    command: 'ffmpeg',
    args: {},
    flatArgs: [
      '-y',
      '-hide_banner',
      '-loglevel',
      'error',
      '-i',
      fromPath,
      '-vn',
      '-acodec',
      'flac',
      '-f',
      'flac',
      '-ar',
      sampleRate.toString(),
      toPath,
    ],
    cwd: process.cwd(),
    handlers: {},
    logger,
    processName: 'convertToFlac',
  });
};
