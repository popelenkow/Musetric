import { type ChannelBuffers } from './buffer.shared.js';

export type ToWorkletMessage =
  | { type: 'play'; buffers: ChannelBuffers; offset: number }
  | { type: 'pause' };

export type FromWorkletMessage = {
  type: 'ended';
};
