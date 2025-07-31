import shaderCode from './index.wgsl?raw';

export const createPipeline = (device: GPUDevice) => {
  const module = device.createShaderModule({
    label: 'slice-waves-shader',
    code: shaderCode,
  });
  return device.createComputePipeline({
    label: 'slice-waves-pipeline',
    layout: 'auto',
    compute: { module, entryPoint: 'main' },
  });
};
