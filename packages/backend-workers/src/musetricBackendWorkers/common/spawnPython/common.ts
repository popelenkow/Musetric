import { Logger } from '../logger.js';

export const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }
  return String(error);
};

export const tryParseMessage = <Message>(line: string): Message | undefined => {
  try {
    return JSON.parse(line);
  } catch {
    return undefined;
  }
};

export const createTextProcessor = (
  logger: Logger,
  onLine: (line: string) => void,
) => {
  let text = '';

  return (data: Buffer) => {
    text += data.toString();

    while (text.includes('\n')) {
      const newlineIndex = text.indexOf('\n');
      const chunk = text.substring(0, newlineIndex);
      const processedChunk = chunk.trim();
      text = text.substring(newlineIndex + 1);

      if (processedChunk) {
        try {
          onLine(processedChunk);
        } catch (error) {
          logger.error(getErrorMessage(error));
        }
      }
    }
  };
};
