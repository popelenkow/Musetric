import {
  createPortMessageHandler,
  wrapMessagePort,
} from '@musetric/resource-utils/messagePort';
import { fromAudioBuffer } from './buffer.js';
import { type FromWorkletEvent, type ToWorkletEvent } from './event.js';
import { createPlayerNode } from './node.js';

export type AudioPlayer = {
  context: AudioContext;
  play: (buffer: AudioBuffer, offset: number) => Promise<void>;
  pause: () => void;
  destroy: () => Promise<void>;
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
  const port = wrapMessagePort(node.port).typed<
    FromWorkletEvent,
    ToWorkletEvent
  >();

  port.onmessage = createPortMessageHandler({
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
      port.postMessage(
        { type: 'play', buffers, offset: startOffset },
        { transfer: buffers },
      );
      startTime = context.currentTime;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(tick);
    },
    pause: () => {
      port.postMessage({ type: 'pause' });
      cancelAnimationFrame(raf);
    },
    destroy: async () => {
      currentBuffer = undefined;
      cancelAnimationFrame(raf);
      port.postMessage({ type: 'pause' });
      port.onmessage = () => undefined;
      node.port.close();
      node.disconnect();
      await context.close();
    },
  };
};
