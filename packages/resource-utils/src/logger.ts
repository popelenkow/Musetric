export type LogContext = Record<string, unknown>;

export type LogMethod = {
  (message: string): void;
  (context: LogContext, message?: string): void;
};

export type Logger = {
  debug: LogMethod;
  info: LogMethod;
  warn: LogMethod;
  error: LogMethod;
};
export type LogLevel = keyof Logger;

const logLevels: LogLevel[] = ['debug', 'info', 'warn', 'error'];

export const isLogLevel = (logLevel?: string): logLevel is LogLevel =>
  logLevels.some((level) => level === logLevel);

export const bindLogger = <T extends Logger>(logger: T): Logger => ({
  debug: logger.debug.bind(logger),
  info: logger.info.bind(logger),
  warn: logger.warn.bind(logger),
  error: logger.error.bind(logger),
});
