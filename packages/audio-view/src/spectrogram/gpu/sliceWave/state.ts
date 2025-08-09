import { ExtPipelineConfig } from '../../pipeline';
import { createParams, StateParams } from './params';
import { createPipeline } from './pipeline';
import { createStateWave, StateWave } from './wave';

export type Config = Pick<
  ExtPipelineConfig,
  | 'windowSize'
  | 'windowCount'
  | 'sampleRate'
  | 'visibleTimeBefore'
  | 'visibleTimeAfter'
  | 'zeroPaddingFactor'
>;

export type State = {
  pipeline: GPUComputePipeline;
  config: Config;
  params: StateParams;
  wave: StateWave;
  bindGroup: GPUBindGroup;
  configure: (waves: GPUBuffer, config: Config) => void;
  write: (waveArray: Float32Array<ArrayBuffer>, progress: number) => void;
  destroy: () => void;
};

export const createState = (device: GPUDevice): State => {
  const pipeline = createPipeline(device);
  const params = createParams(device);
  const wave = createStateWave(device);

  const ref: State = {
    pipeline,
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    config: undefined!,
    params,
    wave,
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    bindGroup: undefined!,
    configure: (out, config) => {
      ref.config = config;
      params.write(config);
      const { visibleSamples } = params.value;
      wave.resize(visibleSamples);
      ref.bindGroup = device.createBindGroup({
        label: 'slice-wave-bind-group',
        layout: pipeline.getBindGroupLayout(0),
        entries: [
          { binding: 0, resource: { buffer: wave.buffer } },
          { binding: 1, resource: { buffer: out } },
          { binding: 2, resource: { buffer: params.buffer } },
        ],
      });
    },
    write: (waveArray, progress) => {
      wave.write(waveArray, progress, ref.config);
    },
    destroy: () => {
      params.destroy();
      wave.destroy();
    },
  };

  return ref;
};
