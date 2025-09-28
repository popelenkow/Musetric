import { spawn } from 'child_process';
import { envs } from '../envs.js';
import { Logger, LogLevel } from '../logger.js';
import {
  createTextProcessor,
  getErrorMessage,
  tryParseMessage,
} from './common.js';

export type LogMessage = {
  level: LogLevel;
  message: string;
};

export type SpawnPythonHandler<Message> = (message: Message) => void;
export type SpawnPythonOptions<Result, Message extends { type: string }> = {
  scriptPath: string;
  args: Record<string, string>;
  handlers: {
    [Type in Message['type']]: SpawnPythonHandler<
      Extract<Message, { type: Type }>
    >;
  };
  onFinish: (code?: number) => Result;
  logger: Logger;
};

export const spawnPython = async <Result, Message extends { type: string }>(
  options: SpawnPythonOptions<Result, Message>,
) =>
  new Promise<Result>((resolve, reject) => {
    const { scriptPath, args, handlers, onFinish, logger } = options;

    const pythonArgs = [scriptPath, ...Object.entries(args).flat()];

    const process = spawn(envs.pythonPath, pythonArgs, {
      stdio: ['pipe', 'pipe', 'pipe'],
      cwd: envs.rootPath,
    });

    const getHandler = (message: Message) => {
      // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
      const type = message.type as keyof typeof handlers;
      // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
      const handler = handlers[type] as SpawnPythonHandler<Message>;
      return handler;
    };
    process.stdout.on(
      'data',
      createTextProcessor(logger, (line) => {
        const message = tryParseMessage<Message>(line);
        if (message === undefined) {
          logger.error(`[Failed to parse JSON] ${line}`);
          return;
        }
        const handler = getHandler(message);
        if (!handler) {
          logger.error(`[Unknown message type] ${message}`);
          return;
        }

        try {
          handler(message);
        } catch (error) {
          logger.error(`[Handler error] ${getErrorMessage(error)}`);
        }
      }),
    );

    process.stderr.on(
      'data',
      createTextProcessor(logger, (line) => {
        const message = tryParseMessage<LogMessage>(line);
        if (message === undefined) {
          logger.error(`[Failed to parse JSON] ${line}`);
          return;
        }
        const log = logger[message.level] ?? logger.info;
        log(message.message);
      }),
    );

    process.on('close', (code) => {
      try {
        const result = onFinish(code ?? undefined);
        resolve(result);
      } catch (error) {
        reject(error);
      }
    });

    process.on('error', (error) => {
      reject(new Error(`[Failed to start Python script] ${error.message}`));
    });
  });
