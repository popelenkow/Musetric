export type Logger = {
  debug: (message: string) => void;
  info: (message: string) => void;
  warn: (message: string) => void;
  error: (message: string) => void;
};
export type LogLevel = keyof Logger;

export const wrapLoggerWithProcessName = (
  logger: Logger,
  processName: string,
): Logger => {
  const name = `\x1b[36m${processName}:\x1b[0m`;
  const createLog = (log: (message: string) => void) => {
    return (message: string) => log.call(logger, `${name} ${message}`);
  };
  return {
    debug: createLog(logger.debug.bind(logger)),
    info: createLog(logger.info.bind(logger)),
    warn: createLog(logger.warn.bind(logger)),
    error: createLog(logger.error.bind(logger)),
  };
};
