import { FastifyLoggerOptions } from 'fastify';
import { PinoLoggerOptions } from 'fastify/types/logger';
import { envs } from '../common/envs';

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
