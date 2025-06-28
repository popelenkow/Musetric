import { useTheme } from '@mui/material';
import { Waveform } from '@musetric/audio-view';
import { FC } from 'react';
import { usePlayerStore } from './store';

export const PlayerWaveform: FC = () => {
  const buffer = usePlayerStore((s) => s.buffer);
  const progress = usePlayerStore((s) => s.progress);
  const seek = usePlayerStore((s) => s.seek);
  const theme = useTheme();

  return (
    <Waveform
      buffer={buffer?.getChannelData(0)}
      progress={progress}
      onSeek={seek}
      playedColor={theme.palette.primary.main}
      unplayedColor={theme.palette.default.dark}
    />
  );
};
