import { Box, useTheme } from '@mui/material';
import { Waveform, waveform } from '@musetric/audio-view';
import { FC, useMemo } from 'react';
import { usePlayerStore } from './store';

export const PlayerWaveform: FC = () => {
  const buffer = usePlayerStore((s) => s.buffer);
  const progress = usePlayerStore((s) => s.progress);
  const seek = usePlayerStore((s) => s.seek);
  const theme = useTheme();

  const colors = useMemo(
    (): waveform.Colors => ({
      played: theme.palette.primary.main,
      unplayed: theme.palette.default.main,
    }),
    [theme],
  );

  return (
    <Box height='80px' width='100%'>
      {buffer && (
        <Waveform
          buffer={buffer?.getChannelData(0)}
          progress={progress}
          onSeek={seek}
          colors={colors}
        />
      )}
    </Box>
  );
};
