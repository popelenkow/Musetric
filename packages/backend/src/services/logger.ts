import { FastifyLoggerOptions } from 'fastify';
import { stdSerializers, LoggerOptions } from 'pino';
import { envs } from '../common/envs.js';

export const logger: FastifyLoggerOptions & LoggerOptions = {
  serializers: {
    error: stdSerializers.err,
    err: stdSerializers.err,
  },
  errorKey: 'error',
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
