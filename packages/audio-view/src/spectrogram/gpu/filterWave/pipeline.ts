import shaderCode from './index.wgsl?raw';

export const createPipeline = (device: GPUDevice) => {
  const module = device.createShaderModule({
    label: 'filter-wave-shader',
    code: shaderCode,
  });
  return device.createComputePipeline({
    label: 'filter-wave-pipeline',
    layout: 'auto',
    compute: { module, entryPoint: 'main' },
  });
};
