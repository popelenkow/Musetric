import fs from 'fs';
import { envs } from '../src/musetricBackendWorkers/common/envs';
import { downloadFile } from './downloadFile';

export const downloadModel = async (): Promise<void> => {
  if (!fs.existsSync(envs.modelsDir)) {
    fs.mkdirSync(envs.modelsDir, { recursive: true });
  }

  if (!fs.existsSync(envs.modelPath)) {
    await downloadFile(envs.modelUrl, envs.modelPath);
  }
  if (!fs.existsSync(envs.configPath)) {
    await downloadFile(envs.configUrl, envs.configPath);
  }
};
