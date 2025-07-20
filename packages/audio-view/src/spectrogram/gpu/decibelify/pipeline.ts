import shaderCode from './index.wgsl?raw';

export const createPipeline = (device: GPUDevice) => {
  const module = device.createShaderModule({
    label: 'decibelify-shader',
    code: shaderCode,
  });
  return device.createComputePipeline({
    label: 'decibelify-pipeline',
    layout: 'auto',
    compute: { module, entryPoint: 'main' },
  });
};
