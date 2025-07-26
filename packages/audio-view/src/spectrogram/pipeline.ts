import { ViewSize } from '../common';
import { Colors } from './colors';

export type PipelineConfigureOptions = {
  windowSize: number;
  colors: Colors;
  sampleRate: number;
  minFrequency: number;
  maxFrequency: number;
  minDecibel: number;
};
export type Pipeline = {
  render: (wave: Float32Array, progress: number) => Promise<void>;
  configure: (options: PipelineConfigureOptions) => void;
  resize: (viewSize: ViewSize) => void;
  destroy: () => void;
};
