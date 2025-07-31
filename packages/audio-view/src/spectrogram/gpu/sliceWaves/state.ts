import { CpuMarker } from '../../../common';
import { createParams, SliceWavesParams, StateParams } from './params';
import { createPipeline } from './pipeline';
import { createStateWave, StateWave } from './wave';

export type State = {
  pipeline: GPUComputePipeline;
  params: StateParams;
  wave: StateWave;
  bindGroup: GPUBindGroup;
  configure: (waves: GPUBuffer, params: SliceWavesParams) => void;
  write: (waveArray: Float32Array, progress: number) => void;
  destroy: () => void;
};

export const createState = (
  device: GPUDevice,
  writeBuffersMarker?: CpuMarker,
): State => {
  const pipeline = createPipeline(device);
  const params = createParams(device);
  const wave = createStateWave(device, writeBuffersMarker);

  const ref: State = {
    pipeline,
    params,
    wave,
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    bindGroup: undefined!,
    configure: (out, paramsValue) => {
      params.write(paramsValue);
      const { visibleSamples } = params.shader;
      wave.resize(visibleSamples);
      ref.bindGroup = device.createBindGroup({
        label: 'slice-waves-bind-group',
        layout: pipeline.getBindGroupLayout(0),
        entries: [
          { binding: 0, resource: { buffer: wave.buffer } },
          { binding: 1, resource: { buffer: out } },
          { binding: 2, resource: { buffer: params.buffer } },
        ],
      });
    },
    write: (waveArray, progress) => {
      const { windowSize, sampleRate, visibleTimeBefore } = ref.params.value;
      wave.write(
        waveArray,
        progress,
        windowSize,
        sampleRate,
        visibleTimeBefore,
      );
    },
    destroy: () => {
      params.destroy();
      wave.destroy();
    },
  };

  return ref;
};
