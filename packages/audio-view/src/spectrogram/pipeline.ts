import { ViewColors, ViewSize } from '../common';
import { WindowFilterKey } from './windowFilters';

export type ZeroPaddingFactor = 1 | 2 | 4;

export type PipelineConfigureOptions = {
  windowSize: number;
  viewSize: ViewSize;
  colors: ViewColors;
  sampleRate: number;
  minFrequency: number;
  maxFrequency: number;
  minDecibel: number;
  windowFilter: WindowFilterKey;
  visibleTimeBefore: number;
  visibleTimeAfter: number;
  zeroPaddingFactor: ZeroPaddingFactor;
};
export type Pipeline = {
  render: (wave: Float32Array, progress: number) => Promise<void>;
  configure: (options: PipelineConfigureOptions) => void;
  destroy: () => void;
};
