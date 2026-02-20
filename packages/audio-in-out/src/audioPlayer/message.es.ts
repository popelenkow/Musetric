import { type ChannelBuffers } from './buffer.es.js';

export type ToWorkletMessage =
  | { type: 'play'; buffers: ChannelBuffers; offset: number }
  | { type: 'pause' };

export type FromWorkletMessage = {
  type: 'ended';
};
