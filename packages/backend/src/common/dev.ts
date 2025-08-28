import { execFileSync } from 'node:child_process';
import fs from 'node:fs';

const getParentCommandLine = (parentProcessId: number): string | undefined => {
  try {
    if (process.platform === 'linux') {
      const cmdlineBuffer = fs.readFileSync(`/proc/${parentProcessId}/cmdline`);
      return cmdlineBuffer.toString('utf8').replace(/\0/g, ' ').trim();
    }
    if (process.platform === 'darwin') {
      const result = execFileSync(
        'ps',
        ['-o', 'command=', '-p', String(parentProcessId)],
        {
          encoding: 'utf8',
        },
      );
      return result.trim();
    }
    if (process.platform === 'win32') {
      const powershellCommand = `Get-CimInstance Win32_Process -Filter "ProcessId=${parentProcessId}" | Select-Object -Expand CommandLine`;
      const result = execFileSync(
        'powershell.exe',
        ['-NoProfile', '-Command', powershellCommand],
        {
          encoding: 'utf8',
        },
      );
      return result.trim();
    }
  } catch {
    return undefined;
  }
  return undefined;
};

const isParentNodeWatchProcess = (parentProcessId: number): boolean => {
  const commandLine = getParentCommandLine(parentProcessId) ?? '';
  return commandLine.includes('--watch');
};

export const killDevHost = (): void => {
  const parentProcessId = process.ppid;

  if (isParentNodeWatchProcess(parentProcessId)) {
    const signal = process.platform === 'win32' ? 'SIGINT' : 'SIGTERM';
    process.kill(parentProcessId, signal);
  }
};
