import { type AudioPlayer, createAudioPlayer } from '@musetric/audio-in-out';
import { createSingletonManager } from '@musetric/resource-utils/singletonManager';
import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';

export type PlayerState = {
  player?: AudioPlayer;
  buffer?: AudioBuffer;
  sampleRate?: number;
  playing: boolean;
  progress: number;
  offset: number;
  startTime: number;
  status: 'pending' | 'success';
};

export const initialState: PlayerState = {
  player: undefined,
  buffer: undefined,
  playing: false,
  progress: 0,
  offset: 0,
  startTime: 0,
  status: 'pending',
};

type Unmount = () => void;

export type PlayerActions = {
  mount: (encodedBuffer: Uint8Array<ArrayBuffer>) => Unmount;
  play: () => Promise<void>;
  pause: () => void;
  seek: (fraction: number) => Promise<void>;
};

type State = PlayerState & PlayerActions;
export const usePlayerStore = create<State>()(
  subscribeWithSelector((set, get) => {
    const singletonManager = createSingletonManager(
      async (encodedBuffer: Uint8Array<ArrayBuffer>) => {
        const player = await createAudioPlayer({
          progress: (progress) => {
            set({ progress });
          },
          end: () => {
            set({ playing: false, progress: 0, offset: 0, startTime: 0 });
          },
        });
        try {
          const buffer = await player.context.decodeAudioData(
            encodedBuffer.buffer,
          );
          set({
            player,
            buffer,
            sampleRate: buffer.sampleRate,
            playing: false,
            progress: 0,
            offset: 0,
            startTime: 0,
            status: 'success',
          });
        } catch {
          return player;
        }

        return player;
      },
      async (player) => {
        await player.destroy();
        set(initialState);
        return Promise.resolve();
      },
    );

    return {
      ...initialState,
      mount: (encodedBuffer) => {
        void singletonManager.create(encodedBuffer);
        return () => {
          void singletonManager.destroy();
        };
      },
      play: async () => {
        const { player, buffer, offset } = get();
        if (!player || !buffer) return;
        await player.play(buffer, offset);
        set({ playing: true, startTime: player.context.currentTime });
      },
      pause: () => {
        const { player, startTime, offset } = get();
        if (!player) return;
        player.pause();
        const context = player.context;
        const newOffset =
          offset +
          Math.floor((context.currentTime - startTime) * context.sampleRate);
        set({ playing: false, offset: newOffset });
      },
      seek: async (fraction) => {
        const { buffer, player, playing } = get();
        if (!buffer || !player) return;
        const context = player.context;
        const newOffset = Math.floor(buffer.length * fraction);
        set({ offset: newOffset, progress: fraction });
        if (playing) {
          await player.play(buffer, newOffset);
          set({ startTime: context.currentTime });
        }
      },
    };
  }),
);
