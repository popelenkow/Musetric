import { ViewSize } from '../common';
import { Colors } from './colors';
import { WindowFilterKey } from './windowFilters';

export type PipelineConfigureOptions = {
  windowSize: number;
  colors: Colors;
  sampleRate: number;
  minFrequency: number;
  maxFrequency: number;
  minDecibel: number;
  windowFilter: WindowFilterKey;
};
export type Pipeline = {
  render: (wave: Float32Array, progress: number) => Promise<void>;
  configure: (options: PipelineConfigureOptions) => void;
  resize: (viewSize: ViewSize) => void;
  destroy: () => void;
};
