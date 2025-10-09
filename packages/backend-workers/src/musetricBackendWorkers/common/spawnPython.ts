import type { Logger } from '@musetric/resource-utils/logger';
import {
  spawnScript,
  SpawnScriptHandlers,
} from '@musetric/resource-utils/spawnScript/index';
import { pythonPath, rootPath } from './pythonPath.js';

export type SpawnPythonOptions<Message extends { type: string }> = {
  scriptPath: string;
  args: Record<string, string>;
  handlers: SpawnScriptHandlers<Message>;
  logger: Logger;
  processName: string;
};
export const spawnPython = async <Message extends { type: string }>(
  options: SpawnPythonOptions<Message>,
) =>
  spawnScript<Message>({
    command: pythonPath,
    args: [options.scriptPath, ...Object.entries(options.args).flat()],
    cwd: rootPath,
    handlers: options.handlers,
    logger: options.logger,
    processName: options.processName,
  });
