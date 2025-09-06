import { dirname, join, basename } from 'node:path';
import { fileURLToPath } from 'node:url';

const getFileNameFromUrl = (url: string): string => {
  return basename(new URL(url).pathname);
};

const rootPath = join(
  dirname(fileURLToPath(import.meta.url)),
  '..',
  '..',
  '..',
);
const separateScriptPath = join(
  rootPath,
  'src',
  'musetricBackendWorkers',
  'separateAudio',
  'index.py',
);
const venvDir = join(rootPath, '.venv');
const pythonPath =
  process.platform === 'win32'
    ? join(venvDir, 'Scripts', 'python.exe')
    : join(venvDir, 'bin', 'python');

const modelsDir = join(rootPath, 'tmp', 'models');

const modelUrl =
  'https://github.com/TRvlvr/model_repo/releases/download/all_public_uvr_models/model_bs_roformer_ep_368_sdr_12.9628.ckpt';
const configUrl =
  'https://raw.githubusercontent.com/TRvlvr/application_data/main/mdx_model_data/mdx_c_configs/model_bs_roformer_ep_368_sdr_12.9628.yaml';

const modelFileName = getFileNameFromUrl(modelUrl);
const configFileName = getFileNameFromUrl(configUrl);

export const envs = {
  rootPath,
  separateScriptPath,
  pythonPath,
  modelsDir,
  modelUrl,
  configUrl,
  modelPath: join(modelsDir, modelFileName),
  configPath: join(modelsDir, configFileName),
};
