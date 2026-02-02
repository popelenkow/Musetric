import { mkdir, writeFile } from 'node:fs/promises';
import { dirname } from 'node:path';
import { Logger } from '@musetric/resource-utils/logger';
import { getDurationSeconds } from './getDuration.js';
import { readPcm } from './readPcm.js';

const waveWidth = 3840;

export type GenerateWaveOptions = {
  fromPath: string;
  toPath: string;
  sampleRate: number;
  logger: Logger;
};

export const generateWave = async (
  options: GenerateWaveOptions,
): Promise<void> => {
  const { fromPath, toPath, sampleRate, logger } = options;
  await mkdir(dirname(toPath), { recursive: true });

  const output = new Float32Array(waveWidth * 2);

  const durationSeconds = await getDurationSeconds(fromPath, logger);
  const totalSamples = Math.floor(durationSeconds * sampleRate);
  const segmentStep = totalSamples / waveWidth;

  let lastSegmentIndex = -1;
  await readPcm({
    fromPath,
    sampleRate,
    logger,
    onSample: (left, right, sampleIndex) => {
      const value = (left + right) * 0.5;
      const segmentIndex = Math.floor(sampleIndex / segmentStep);
      if (segmentIndex >= waveWidth) {
        return;
      }
      const baseIndex = segmentIndex * 2;
      if (segmentIndex !== lastSegmentIndex) {
        output[baseIndex] = value;
        output[baseIndex + 1] = value;
        lastSegmentIndex = segmentIndex;
      }
      if (value < output[baseIndex]) {
        output[baseIndex] = value;
      }
      if (value > output[baseIndex + 1]) {
        output[baseIndex + 1] = value;
      }
    },
  });

  await writeFile(
    toPath,
    Buffer.from(output.buffer, output.byteOffset, output.byteLength),
  );
};
