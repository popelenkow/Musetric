import fs from 'fs';
import path from 'path';
import axios from 'axios';

const modelUrl =
  'https://github.com/TRvlvr/model_repo/releases/download/all_public_uvr_models/model_bs_roformer_ep_368_sdr_12.9628.ckpt';
const configUrl =
  'https://raw.githubusercontent.com/TRvlvr/application_data/main/mdx_model_data/mdx_c_configs/model_bs_roformer_ep_368_sdr_12.9628.yaml';

const modelsDir = path.join(process.cwd(), 'tmp', 'models');
const modelPath = path.join(
  modelsDir,
  'model_bs_roformer_ep_368_sdr_12.9628.ckpt',
);
const configPath = path.join(
  modelsDir,
  'model_bs_roformer_ep_368_sdr_12.9628.yaml',
);

const downloadFile = async (url: string, filePath: string): Promise<void> => {
  const response = await axios({
    method: 'GET',
    url,
    responseType: 'arraybuffer',
  });

  fs.writeFileSync(filePath, response.data);
};

const downloadModel = async (): Promise<void> => {
  if (!fs.existsSync(modelsDir)) {
    fs.mkdirSync(modelsDir, { recursive: true });
  }

  if (!fs.existsSync(modelPath)) {
    console.log('Downloading model...');
    try {
      await downloadFile(modelUrl, modelPath);
    } catch (error) {
      console.error(
        'Failed to download model:',
        error instanceof Error ? error.message : error,
      );
      throw error;
    }
  }

  if (!fs.existsSync(configPath)) {
    try {
      await downloadFile(configUrl, configPath);
    } catch (error) {
      console.error(
        'Failed to download configuration:',
        error instanceof Error ? error.message : error,
      );
      throw error;
    }
  }
};

if (import.meta.url === `file://${process.argv[1]}`) {
  try {
    await downloadModel();
  } catch {
    process.exit(1);
  }
}

export { downloadModel };
