import { mkdir, writeFile } from 'node:fs/promises';
import { dirname } from 'node:path';
import { Logger } from '@musetric/resource-utils/logger';

export type GenerateWaveOptions = {
  fromPath: string;
  toPath: string;
  sampleRate: number;
  logger: Logger;
};

export const generateWave = async (
  options: GenerateWaveOptions,
): Promise<void> => {
  const { toPath } = options;
  await mkdir(dirname(toPath), { recursive: true });

  const output = new Float32Array(0);

  await writeFile(
    toPath,
    Buffer.from(output.buffer, output.byteOffset, output.byteLength),
  );
};
