import moveCode from './move.wgsl?raw';
import runCode from './run.wgsl?raw';

export type Pipelines = {
  layout: GPUBindGroupLayout;
  run: GPUComputePipeline;
  move: GPUComputePipeline;
};

export const createPipelines = (device: GPUDevice): Pipelines => {
  const layout = device.createBindGroupLayout({
    label: 'magnitudify-bind-group-layout',
    entries: [
      {
        binding: 0,
        visibility: GPUShaderStage.COMPUTE,
        buffer: { type: 'storage' },
      },
      {
        binding: 1,
        visibility: GPUShaderStage.COMPUTE,
        buffer: { type: 'storage' },
      },
      {
        binding: 2,
        visibility: GPUShaderStage.COMPUTE,
        buffer: { type: 'uniform' },
      },
    ],
  });
  const pipelineLayout = device.createPipelineLayout({
    label: 'magnitudify-pipeline-layout',
    bindGroupLayouts: [layout],
  });

  const runModule = device.createShaderModule({
    label: 'magnitudify-run-shader',
    code: runCode,
  });
  const run = device.createComputePipeline({
    label: 'magnitudify-run-pipeline',
    layout: pipelineLayout,
    compute: { module: runModule, entryPoint: 'main' },
  });

  const moveModule = device.createShaderModule({
    label: 'magnitudify-move-shader',
    code: moveCode,
  });
  const move = device.createComputePipeline({
    label: 'magnitudify-move-pipeline',
    layout: pipelineLayout,
    compute: { module: moveModule, entryPoint: 'main' },
  });

  return {
    layout,
    run,
    move,
  };
};
