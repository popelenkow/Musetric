import { ChannelBuffers } from './buffer.js';

export type ToWorkletEvent =
  | { type: 'play'; buffers: ChannelBuffers; offset: number }
  | { type: 'pause' };

export type FromWorkletEvent = {
  type: 'ended';
};
