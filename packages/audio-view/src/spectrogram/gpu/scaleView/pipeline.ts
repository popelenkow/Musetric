import shaderCode from './index.wgsl?raw';

export const createPipeline = (device: GPUDevice) => {
  const module = device.createShaderModule({
    label: 'scale-view-column-shader',
    code: shaderCode,
  });
  return device.createComputePipeline({
    label: 'scale-view-column-pipeline',
    layout: 'auto',
    compute: { module, entryPoint: 'main' },
  });
};
