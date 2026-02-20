import { type ChannelBuffers } from './buffer.es.js';

export const fromAudioBuffer = (buffer: AudioBuffer): ChannelBuffers => {
  const first = new Float32Array(buffer.getChannelData(0)).buffer;
  if (buffer.numberOfChannels > 1) {
    const second = new Float32Array(buffer.getChannelData(1)).buffer;
    return [first, second];
  }
  return [first];
};
