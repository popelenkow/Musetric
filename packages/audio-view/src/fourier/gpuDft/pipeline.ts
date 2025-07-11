import shaderCode from './index.wgsl?raw';

export const createPipeline = (device: GPUDevice) => {
  const module = device.createShaderModule({
    label: 'dft-shader',
    code: shaderCode,
  });
  return device.createComputePipeline({
    label: 'dft-pipeline',
    layout: 'auto',
    compute: { module, entryPoint: 'main' },
  });
};
