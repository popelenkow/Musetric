import shaderCode from './index.wgsl?raw';

export const createPipeline = (device: GPUDevice) => {
  const module = device.createShaderModule({
    label: 'decibel-normalizer-shader',
    code: shaderCode,
  });
  return device.createComputePipeline({
    label: 'decibel-normalizer-pipeline',
    layout: 'auto',
    compute: { module, entryPoint: 'main' },
  });
};
