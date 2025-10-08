import fs from 'fs';
import { dirname } from 'node:path';
import { downloadFile } from './downloadFile.js';

export const defaultModelUrl =
  'https://github.com/TRvlvr/model_repo/releases/download/all_public_uvr_models/model_bs_roformer_ep_368_sdr_12.9628.ckpt';
export const defaultModelConfigUrl =
  'https://raw.githubusercontent.com/TRvlvr/application_data/main/mdx_model_data/mdx_c_configs/model_bs_roformer_ep_368_sdr_12.9628.yaml';

export type DownloadModelOptions = {
  modelPath: string;
  modelConfigPath: string;
  modelUrl?: string;
  modelConfigUrl?: string;
};

const ensureDirectory = (filePath: string) => {
  const directory = dirname(filePath);
  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory, { recursive: true });
  }
};

export const downloadModel = async (
  options: DownloadModelOptions,
): Promise<void> => {
  const {
    modelPath,
    modelConfigPath,
    modelUrl = defaultModelUrl,
    modelConfigUrl = defaultModelConfigUrl,
  } = options;

  if (!fs.existsSync(modelPath)) {
    ensureDirectory(modelPath);
    await downloadFile(modelUrl, modelPath);
  }
  if (!fs.existsSync(modelConfigPath)) {
    ensureDirectory(modelConfigPath);
    await downloadFile(modelConfigUrl, modelConfigPath);
  }
};
