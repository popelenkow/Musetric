export type ChannelBuffers = [ArrayBuffer] | [ArrayBuffer, ArrayBuffer];
export type ChannelArrays = [Float32Array] | [Float32Array, Float32Array];

export const toBuffers = (arrays: ChannelArrays): ChannelBuffers =>
  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
  arrays.map((x) => x.buffer) as ChannelBuffers;

export const toArrays = (buffers: ChannelBuffers): ChannelArrays =>
  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
  buffers.map((x) => new Float32Array(x)) as ChannelArrays;

export const fromAudioBuffer = (buffer: AudioBuffer): ChannelBuffers => {
  const first = new Float32Array(buffer.getChannelData(0)).buffer;
  if (buffer.numberOfChannels > 1) {
    const second = new Float32Array(buffer.getChannelData(1)).buffer;
    return [first, second];
  }
  return [first];
};
