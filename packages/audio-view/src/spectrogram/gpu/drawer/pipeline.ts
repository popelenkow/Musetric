import fragmentCode from './fragment.wgsl?raw';
import vertexCode from './vertex.wgsl?raw';

export const createPipeline = (
  device: GPUDevice,
  context: GPUCanvasContext,
) => {
  const format = navigator.gpu.getPreferredCanvasFormat();
  context.configure({ device, format });

  const vertexModule = device.createShaderModule({
    label: 'drawer-vertex-shader',
    code: vertexCode,
  });
  const fragmentModule = device.createShaderModule({
    label: 'drawer-fragment-shader',
    code: fragmentCode,
  });

  return device.createRenderPipeline({
    label: 'drawer-pipeline',
    layout: 'auto',
    vertex: { module: vertexModule, entryPoint: 'main' },
    fragment: {
      module: fragmentModule,
      entryPoint: 'main',
      targets: [{ format }],
    },
    primitive: { topology: 'triangle-list' },
  });
};
