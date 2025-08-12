import { execSync } from 'child_process';
import { platform } from 'os';

const isCheck = process.env.workspace_mode === 'check';
const isMacOS = platform() === 'darwin';

const hasCudaSupport = (): boolean => {
  if (isMacOS) return false;
  if (isCheck) return false;

  try {
    execSync('nvidia-smi', { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
};

try {
  const isCuda = hasCudaSupport();
  const extra = isCuda ? '--extra cuda' : '--extra cpu';
  const command = `uv sync --group check ${extra}`;
  console.log(`Running command: ${command}`);
  execSync(command, {
    stdio: 'inherit',
  });
} catch {
  process.exit(1);
}
