import { execSync } from 'child_process';
import { platform } from 'os';
import { downloadModel } from './downloadModel';

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
  const extraGpu = isCuda ? ' --extra cuda' : '';
  const command = 'uv sync --group check' + extraGpu;
  console.log(`Running command: ${command}`);
  execSync(command, {
    stdio: 'inherit',
  });

  if (!isCheck) {
    await downloadModel();
  }
} catch {
  process.exit(1);
}
