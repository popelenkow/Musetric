import shaderCode from './index.wgsl?raw';

export const createPipeline = (device: GPUDevice) => {
  const module = device.createShaderModule({
    label: 'fft4-shader',
    code: shaderCode,
  });
  return device.createComputePipeline({
    label: 'fft4-pipeline',
    layout: 'auto',
    compute: { module, entryPoint: 'main' },
  });
};
