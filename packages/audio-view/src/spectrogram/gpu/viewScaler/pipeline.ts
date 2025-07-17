import shaderCode from './index.wgsl?raw';

export const createPipeline = (device: GPUDevice) => {
  const module = device.createShaderModule({
    label: 'drawer-column-shader',
    code: shaderCode,
  });
  return device.createComputePipeline({
    label: 'drawer-column-pipeline',
    layout: 'auto',
    compute: { module, entryPoint: 'main' },
  });
};
