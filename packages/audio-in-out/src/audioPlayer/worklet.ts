import { createPort } from '../port.js';
import { toArrays, type ChannelArrays } from './buffer.js';
import type { FromWorkletEvent, ToWorkletEvent } from './event.js';

type Process = (output: Float32Array<ArrayBuffer>[]) => boolean;

type Processor = {
  process: Process;
};
const createProcessor = (rawPort: MessagePort): Processor => {
  let buffers: ChannelArrays | undefined = undefined;
  let offset = 0;
  let playing = false;

  const port = createPort<ToWorkletEvent, FromWorkletEvent>(rawPort, {
    play: (message) => {
      buffers = toArrays(message.buffers);
      offset = message.offset;
      playing = true;
    },
    pause: () => {
      playing = false;
    },
  });

  return {
    process: (output) => {
      if (!buffers || !playing) {
        for (const out of output) {
          out.fill(0);
        }
        return true;
      }

      for (let channel = 0; channel < output.length; channel++) {
        const out = output[channel];
        const data = buffers[channel] ?? new Float32Array(0);
        for (let i = 0; i < out.length; i++) {
          const index = offset + i;
          out[i] = index < data.length ? data[index] : 0;
        }
      }

      const length = buffers[0].length;
      offset += output[0].length;
      if (offset >= length) {
        playing = false;
        port.send({ type: 'ended' });
      }

      return true;
    },
  };
};

// eslint-disable-next-line no-restricted-syntax
class PlayerProcessor extends AudioWorkletProcessor {
  private readonly processor: Processor;
  constructor() {
    super();
    // eslint-disable-next-line no-restricted-syntax
    this.processor = createProcessor(this.port);
  }
  process(
    _inputs: Float32Array<ArrayBuffer>[][],
    outputs: Float32Array<ArrayBuffer>[][],
  ): boolean {
    // eslint-disable-next-line no-restricted-syntax
    return this.processor.process(outputs[0]);
  }
}

registerProcessor('player-processor', PlayerProcessor);
