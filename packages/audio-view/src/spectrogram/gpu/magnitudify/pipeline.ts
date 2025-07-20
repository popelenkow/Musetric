import shaderCode from './index.wgsl?raw';

export const createPipeline = (device: GPUDevice) => {
  const module = device.createShaderModule({
    label: 'magnitudify-shader',
    code: shaderCode,
  });
  return device.createComputePipeline({
    label: 'magnitudify-pipeline',
    layout: 'auto',
    compute: { module, entryPoint: 'main' },
  });
};
