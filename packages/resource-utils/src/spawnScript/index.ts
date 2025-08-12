import { spawn } from 'node:child_process';
import type { Logger, LogLevel } from '../logger.js';
import { createTextProcessor, tryParseMessage } from './common.js';

export type LogInfo = {
  level: LogLevel;
  message: string;
};

export type SpawnScriptHandler<Message, Type> = (
  message: Extract<Message, { type: Type }>,
) => void;

export type SpawnScriptHandlers<Message extends { type: string }> = {
  [Type in Exclude<Message['type'], 'result'>]: SpawnScriptHandler<
    Message,
    Type
  >;
};

export type SpawnScriptOptions<Message extends { type: string }> = {
  command: string;
  args: string[];
  cwd: string;
  handlers: SpawnScriptHandlers<Message>;
  logger: Logger;
  processName: string;
};
export const spawnScript = async <Message extends { type: string }>(
  options: SpawnScriptOptions<Message>,
) => {
  type Result = Extract<Message, { type: 'result' }>;
  return new Promise<Result | undefined>((resolve, reject) => {
    const { command, args, cwd, logger, processName } = options;

    let result: Result | undefined = undefined;
    const handlers = {
      ...options.handlers,
      result: (message: Result) => {
        result = message;
      },
    };

    const childProcess = spawn(command, args, {
      stdio: ['pipe', 'pipe', 'pipe'],
      cwd,
    });

    type Handler = (message: Message) => void;
    const getHandler = (message: Message): Handler => {
      // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
      const type = message.type as keyof typeof handlers;
      // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
      const handler = handlers[type] as Handler;
      return handler;
    };

    childProcess.stdout.on(
      'data',
      createTextProcessor(logger, processName, (line) => {
        const message = tryParseMessage<Message>(line);
        if (message === undefined) {
          logger.error(
            { processName, line },
            'Child script cannot parse message',
          );
          return;
        }
        const handler = getHandler(message);
        if (!handler) {
          logger.error(
            { processName, line },
            'Child script received unknown message',
          );
          return;
        }

        try {
          handler(message);
        } catch (error) {
          logger.error({ processName, error }, 'Child script handler error');
        }
      }),
    );

    childProcess.stderr.on(
      'data',
      createTextProcessor(logger, processName, (line) => {
        const info = tryParseMessage<LogInfo>(line);
        if (info === undefined) {
          logger.error(
            { processName, line },
            'Child script cannot parse log info',
          );
          return;
        }
        const log = logger[info.level] ?? logger.info;
        log({ processName }, info.message);
      }),
    );

    childProcess.on('close', (code) => {
      try {
        if (code !== 0) {
          throw new Error(`Child script failed with code ${code}`);
        }
        resolve(result);
      } catch (error) {
        reject(error);
      }
    });

    childProcess.on('error', (error) => {
      logger.error(
        { processName, error: error.message },
        'Child script process error',
      );
      reject(new Error(`Child script error: ${error.message}`));
    });
  });
};
