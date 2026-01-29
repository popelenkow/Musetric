import { mkdir } from 'node:fs/promises';
import { dirname } from 'node:path';
import { Logger } from '@musetric/resource-utils/logger';
import { spawnScript } from '@musetric/resource-utils/spawnScript/index';

const fragmentDurationSeconds = 2;

export type ConvertToFmp4Options = {
  fromPath: string;
  toPath: string;
  sampleRate: number;
  logger: Logger;
};

export const convertToFmp4 = async (
  options: ConvertToFmp4Options,
): Promise<void> => {
  const { fromPath, toPath, sampleRate, logger } = options;
  const fragmentDurationMicros = fragmentDurationSeconds * 1_000_000;
  await mkdir(dirname(toPath), { recursive: true });

  await spawnScript({
    command: 'ffmpeg',
    args: {},
    flatArgs: [
      '-y',
      '-hide_banner',
      '-loglevel',
      'error',
      '-i',
      fromPath,
      '-map',
      '0:a:0',
      '-sn',
      '-dn',
      '-vn',
      '-ar',
      sampleRate.toString(),
      '-c:a',
      'aac',
      '-profile:a',
      'aac_low',
      '-b:a',
      '256k',
      '-f',
      'mp4',
      '-movflags',
      '+frag_keyframe+empty_moov+default_base_moof',
      '-frag_duration',
      fragmentDurationMicros.toString(),
      '-min_frag_duration',
      fragmentDurationMicros.toString(),
      toPath,
    ],
    cwd: process.cwd(),
    handlers: {},
    logger,
    processName: 'convertToFmp4',
  });
};
