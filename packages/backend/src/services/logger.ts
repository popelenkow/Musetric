import { FastifyLoggerOptions } from 'fastify';
import type { LoggerOptions as PinoLoggerOptions } from 'pino';
import { envs } from '../common/envs.js';

export const logger: FastifyLoggerOptions & PinoLoggerOptions = {
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true,
      translateTime: 'HH:MM:ss.l',
      ignore: 'pid,hostname',
    },
  },
  level: envs.logLevel,
};
