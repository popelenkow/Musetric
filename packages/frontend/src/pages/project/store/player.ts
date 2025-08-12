import { api } from '@musetric/api';
import { createAudioPlayer, AudioPlayer } from '@musetric/audio-in-out';
import axios from 'axios';
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
  initialized: boolean;
  currentTrackType?: 'original' | 'vocal' | 'instrumental';
};

export const initialState: PlayerState = {
  player: undefined,
  buffer: undefined,
  playing: false,
  progress: 0,
  offset: 0,
  startTime: 0,
  initialized: false,
  currentTrackType: undefined,
};

type Unmount = () => void;

export type PlayerActions = {
  mount: () => Unmount;
  load: (rawBuffer: Uint8Array<ArrayBufferLike>) => Promise<void>;
  loadSmartTrack: (projectId: number) => Promise<'vocal' | 'original'>;
  play: () => Promise<void>;
  pause: () => void;
  seek: (fraction: number) => Promise<void>;
  setProgress: (progress: number) => void;
};

type State = PlayerState & PlayerActions;
export const usePlayerStore = create<State>()(
  subscribeWithSelector((set, get) => ({
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
        sampleRate: buffer.sampleRate,
        playing: false,
        progress: 0,
        offset: 0,
        startTime: 0,
      });
    },
    loadSmartTrack: async (projectId: number) => {
      // Try to load vocal track first
      try {
        const vocalBuffer = await api.sound.get.request(axios, {
          params: { projectId, type: 'vocal' },
        });
        await get().load(vocalBuffer);
        set({ currentTrackType: 'vocal' });
        return 'vocal';
      } catch {
        // Fallback to original track
        try {
          const originalBuffer = await api.sound.get.request(axios, {
            params: { projectId, type: 'original' },
          });
          await get().load(originalBuffer);
          set({ currentTrackType: 'original' });
          return 'original';
        } catch (error) {
          console.error('Failed to load any track:', error);
          throw error;
        }
      }
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
  })),
);
