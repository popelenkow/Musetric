import { createPort } from '../port.js';
import { fromAudioBuffer } from './buffer.js';
import { type FromWorkletEvent, type ToWorkletEvent } from './event.js';
import { createPlayerNode } from './node.js';

export type AudioPlayer = {
  context: AudioContext;
  play: (buffer: AudioBuffer, offset: number) => Promise<void>;
  pause: () => void;
};

export type AudioPlayerOptions = {
  progress?: (progress: number) => void;
  end?: () => void;
};

export const createAudioPlayer = async (
  options: AudioPlayerOptions = {},
): Promise<AudioPlayer> => {
  const context = new AudioContext();
  const node = await createPlayerNode(context);
  const port = createPort<FromWorkletEvent, ToWorkletEvent>(node.port, {
    ended: () => options.end?.(),
  });

  let currentBuffer: AudioBuffer | undefined = undefined;
  let offset = 0;
  let startTime = 0;
  let raf = 0;

  const tick = () => {
    if (!currentBuffer) return;
    const frame =
      offset +
      Math.floor((context.currentTime - startTime) * context.sampleRate);
    const progress = Math.min(frame / currentBuffer.length, 1);
    options.progress?.(progress);
    raf = requestAnimationFrame(tick);
  };

  return {
    context,
    play: async (buffer, startOffset) => {
      currentBuffer = buffer;
      offset = startOffset;
      if (context.state === 'suspended') {
        await context.resume();
      }
      const buffers = fromAudioBuffer(buffer);
      port.send(
        { type: 'play', buffers, offset: startOffset },
        { transfer: buffers },
      );
      startTime = context.currentTime;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(tick);
    },
    pause: () => {
      port.send({ type: 'pause' });
      cancelAnimationFrame(raf);
    },
  };
};
