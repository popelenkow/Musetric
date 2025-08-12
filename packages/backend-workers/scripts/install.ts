import { execSync } from 'child_process';
import { downloadModel } from './downloadModel';

const isCheck = process.env.ci_check === 'true';

try {
  execSync(
    isCheck
      ? 'uv sync --group dev --no-install-project'
      : 'uv sync --group dev',
    { stdio: 'inherit' },
  );

  if (!isCheck) {
    await downloadModel();
  }
} catch {
  process.exit(1);
}
