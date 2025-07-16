import { createCallLatest, subComplexArray } from '../../common';
import type { CpuFourierMode } from '../../fourier';
import { cpuFouriers } from '../../fourier';
import { Colors } from '../colors';
import { Parameters } from '../parameters';
import { sliceWaves } from '../sliceWaves';
import { createDrawer } from './drawer';
import { normalizeDecibel } from './normalizeDecibel';
import { normalizeMagnitude } from './normalizeMagnitude';
import { createPipelineArrays } from './pipelineArrays';

export type CreatePipelineOptions = {
  canvas: HTMLCanvasElement;
  windowSize: number;
  fourierMode: CpuFourierMode;
  colors: Colors;
  parameters: Parameters;
};

export type Pipeline = {
  render: (wave: Float32Array, progress: number) => Promise<void>;
  resize: () => void;
  destroy: () => void;
};
export const createPipeline = async (
  options: CreatePipelineOptions,
): Promise<Pipeline> => {
  const { canvas, windowSize, fourierMode, colors, parameters } = options;

  const drawer = createDrawer({ canvas, colors, windowSize });
  const createFourier = cpuFouriers[fourierMode];
  const fourier = await createFourier({ windowSize });

  let isResizeRequested = false;
  let arrays = createPipelineArrays(windowSize, drawer.width);

  const resize = () => {
    drawer.resize();
    arrays = createPipelineArrays(windowSize, drawer.width);
  };

  const render = (wave: Float32Array, progress: number) => {
    if (isResizeRequested) {
      isResizeRequested = false;
      return resize();
    }
    const { width } = drawer;
    const windowCount = width;
    const { frequencies, magnitudes, waves } = arrays;

    sliceWaves({ windowSize, windowCount, wave, waves });
    fourier.forward(waves, frequencies);

    for (let x = 0; x < width; x++) {
      const start = x * windowSize;
      const end = start + windowSize;
      const frequency = subComplexArray(frequencies, start, end);
      const magnitude = magnitudes.subarray(start / 2, end / 2);
      normalizeMagnitude(frequency, magnitude);
      normalizeDecibel(magnitude);
    }
    drawer.render(magnitudes, progress, parameters);
  };

  return {
    render: createCallLatest(async (wave, progress) => {
      render(wave, progress);
    }),
    resize: () => {
      isResizeRequested = true;
    },
    destroy: () => {
      // No resources to clean up in CPU implementation
    },
  };
};
