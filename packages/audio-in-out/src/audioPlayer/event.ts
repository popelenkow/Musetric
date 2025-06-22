import { ChannelBuffers } from './buffer';

export type ToWorkletEvent =
  | { type: 'play'; buffers: ChannelBuffers; offset: number }
  | { type: 'pause' };

export type FromWorkletEvent = {
  type: 'ended';
};
