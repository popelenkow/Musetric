import { existsSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import chalk from 'chalk';
import { separateAudio } from './src';
import { Logger } from './src/musetricBackendWorkers/common/logger';
const currentDir = dirname(fileURLToPath(import.meta.url));

const inputPath = join(currentDir, 'tmp', 'ado.webm');
const vocalPath = join(currentDir, 'tmp', 'ado_vocal.flac');
const instrumentalPath = join(currentDir, 'tmp', 'ado_instrumental.flac');

const createColoredLogger = (): Logger => ({
  debug: (message: string) => console.log(chalk.gray(`${message}`)),
  info: (message: string) => console.log(`${message}`),
  warn: (message: string) => console.warn(chalk.yellow(`${message}`)),
  error: (message: string) => console.error(chalk.red(`${message}`)),
});

const logger = createColoredLogger();

if (!existsSync(inputPath)) {
  logger.error(`❌ Input file not found: ${inputPath}`);
  process.exit(1);
}

const inputStats = statSync(inputPath);
logger.info(
  `✅ Input file found, size: ${Math.round(inputStats.size / 1024)} KB`,
);

logger.info('🚀 Starting separation process...');
const startTime = Date.now();

try {
  const result = await separateAudio({
    inputPath,
    vocalPath,
    instrumentalPath,
    onProgress: (progress) => {
      const elapsed = Math.round((Date.now() - startTime) / 1000);
      logger.info(`[${elapsed}s] ${progress.stage}: ${progress.progress}`);
    },
    logger,
    logLevel: 'debug',
  });

  const totalTime = Math.round((Date.now() - startTime) / 1000);
  logger.info(`✅ Separation completed in ${totalTime}s!`);
  logger.info('📁 Result files:');
  logger.info(
    `  Vocal: ${result.vocal.filename} (${result.vocal.contentType})`,
  );
  logger.info(
    `  Instrumental: ${result.instrumental.filename} (${result.instrumental.contentType})`,
  );

  if (existsSync(vocalPath)) {
    const vocalStats = statSync(vocalPath);
    logger.info(`  Vocal file size: ${Math.round(vocalStats.size / 1024)} KB`);
  } else {
    logger.warn('  ⚠️ Vocal file not found');
  }

  if (existsSync(instrumentalPath)) {
    const instrumentalStats = statSync(instrumentalPath);
    logger.info(
      `  Instrumental file size: ${Math.round(instrumentalStats.size / 1024)} KB`,
    );
  } else {
    logger.warn('  ⚠️ Instrumental file not found');
  }
} catch (error) {
  const totalTime = Math.round((Date.now() - startTime) / 1000);
  logger.error(`❌ Error after ${totalTime}s: ${error}`);
  process.exit(1);
}
