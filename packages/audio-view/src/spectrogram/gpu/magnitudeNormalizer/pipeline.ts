import shaderCode from './index.wgsl?raw';

export const createPipeline = (device: GPUDevice) => {
  const module = device.createShaderModule({
    label: 'magnitude-normalizer-shader',
    code: shaderCode,
  });
  return device.createComputePipeline({
    label: 'magnitude-normalizer-pipeline',
    layout: 'auto',
    compute: { module, entryPoint: 'main' },
  });
};
