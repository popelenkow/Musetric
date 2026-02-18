import { type api } from '@musetric/api';
import { type ViewColors, type ViewSize } from '../common/index.js';

export type ToWaveformMessage =
  | {
      type: 'init';
      projectId: number;
      waveType: api.wave.Type;
      colors: ViewColors;
      progress: number;
    }
  | {
      type: 'attachCanvas';
      canvas: OffscreenCanvas;
    }
  | {
      type: 'progress';
      progress: number;
    }
  | {
      type: 'colors';
      colors: ViewColors;
    }
  | {
      type: 'resize';
      viewSize: ViewSize;
    };

export type FromWaveformMessage = {
  type: 'state';
  status: 'pending' | 'error' | 'success';
};
