import { AudioPlayer } from '@musetric/audio-in-out';

export type PlayerState = {
  player?: AudioPlayer;
  buffer?: AudioBuffer;
  playing: boolean;
  progress: number;
  offset: number;
  startTime: number;
  initialized: boolean;
};

export const initialState: PlayerState = {
  player: undefined,
  buffer: undefined,
  playing: false,
  progress: 0,
  offset: 0,
  startTime: 0,
  initialized: false,
};

type Unmount = () => void;

export type PlayerActions = {
  mount: () => Unmount;
  load: (rawBuffer: Uint8Array<ArrayBufferLike>) => Promise<void>;
  play: () => Promise<void>;
  pause: () => void;
  seek: (fraction: number) => Promise<void>;
  setProgress: (progress: number) => void;
};
