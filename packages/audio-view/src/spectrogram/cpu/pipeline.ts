import {
  ComplexArray,
  CpuFourierMode,
  cpuFouriers,
  normComplexArray,
} from '../../fourier';
import { Gradients, Parameters } from '../common';
import { createDrawer } from './drawer';
import { normDecibel } from './normDecibel';

export type PipelineRender = (
  input: Float32Array,
  progress: number,
  gradients: Gradients,
) => Promise<void>;

export type Pipeline = {
  render: PipelineRender;
};
export const createPipeline = async (
  canvas: HTMLCanvasElement,
  parameters: Parameters,
  mode: CpuFourierMode,
): Promise<Pipeline> => {
  const { sampleRate, windowSize, minFrequency, maxFrequency } = parameters;

  const width = canvas.clientWidth;
  const height = canvas.clientHeight;

  const fullBins = windowSize / 2;
  const calcStep = (len: number) => (len - windowSize) / width;
  const maxBin = Math.min(
    Math.floor((maxFrequency / sampleRate) * windowSize),
    fullBins,
  );
  const minBin = Math.max(
    Math.floor((minFrequency / sampleRate) * windowSize),
    0,
  );
  const logMin = Math.log(minBin + 1);
  const logRange = Math.log(maxBin + 1) - logMin;

  const frequency: ComplexArray = {
    real: new Float32Array(windowSize * width),
    imag: new Float32Array(windowSize * width),
  };
  const magnitude = new Float32Array(fullBins);

  const wave: ComplexArray = {
    real: new Float32Array(windowSize * width),
    imag: new Float32Array(windowSize * width),
  };

  const createFourier = cpuFouriers[mode];
  const fourier = await createFourier(windowSize);
  const drawer = createDrawer(canvas);

  const columns: Uint8Array[] = new Array(width)
    .fill(0)
    .map(() => new Uint8Array(height));

  return {
    render: async (input, progress, gradients) => {
      const step = calcStep(input.length);

      for (let x = 0; x < width; x++) {
        const start = Math.floor(x * step);
        const slice = input.subarray(start, start + windowSize);
        wave.real.set(slice, x * windowSize);
        wave.imag.fill(0, x * windowSize, (x + 1) * windowSize);
      }

      await fourier.forward(wave, frequency);

      for (let x = 0; x < width; x++) {
        const slice: ComplexArray = {
          real: frequency.real.subarray(x * windowSize, (x + 1) * windowSize),
          imag: frequency.imag.subarray(x * windowSize, (x + 1) * windowSize),
        };
        normComplexArray(slice, magnitude);
        normDecibel(magnitude);
        const decibel = magnitude;

        const column = columns[x];
        for (let y = 0; y < height; y++) {
          const ratio = 1 - y / (height - 1);
          const raw = Math.exp(logMin + logRange * ratio);
          const idx = Math.max(
            minBin,
            Math.min(Math.floor(raw) - 1, maxBin - 1),
          );
          column[y] = Math.round(decibel[idx] * 255);
        }
      }

      drawer.render(columns, progress, gradients);
    },
  };
};
