import { execSync } from 'child_process';
import { platform } from 'os';

const isCheck = process.env.workspace_mode === 'check';
const isBuild = process.env.workspace_mode === 'build';
const isDocker = process.env.workspace_mode === 'docker';
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

const syncUv = () => {
  const isCuda = hasCudaSupport();
  const frozen = isCheck || isBuild ? ' --frozen' : '';
  const groupCheck = isBuild ? '' : ' --group check';
  const extra = isCuda ? ' --extra cuda' : ' --extra cpu';
  const command = `uv sync${frozen}${groupCheck}${extra}`;
  console.log(`Running command: ${command}`);
  execSync(command, {
    stdio: 'inherit',
  });
};

try {
  if (!isDocker) {
    syncUv();
  }
} catch {
  process.exit(1);
}
