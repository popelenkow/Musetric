import { createAudioPlayer } from '@musetric/audio-in-out';
import { create } from 'zustand';
import { initialState, PlayerActions, PlayerState } from './types';

type State = PlayerState & PlayerActions;

export const usePlayerStore = create<State>((set, get) => ({
  ...initialState,
  mount: () => {
    const init = async () => {
      const player = await createAudioPlayer({
        progress: (progress) => {
          set({ progress });
        },
        end: () => {
          set({ playing: false, progress: 0, offset: 0, startTime: 0 });
        },
      });
      set({ player, initialized: true });
    };
    void init();
    return () => {
      set(initialState);
    };
  },
  load: async (rawBuffer) => {
    const { player } = get();
    if (!player) return;
    player.pause();
    const buffer = await player.context.decodeAudioData(
      rawBuffer.slice().buffer,
    );
    set({
      buffer,
      playing: false,
      progress: 0,
      offset: 0,
      startTime: 0,
    });
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
  setProgress: (progress) => set({ progress }),
}));
