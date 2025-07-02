import { Box, useTheme } from '@mui/material';
import {
  Spectrogram,
  SpectrogramColors,
  SpectrogramParameters,
} from '@musetric/audio-view';
import { FC, useMemo } from 'react';
import { usePlayerStore } from './store';

export const PlayerSpectrogram: FC = () => {
  const buffer = usePlayerStore((s) => s.buffer);
  const seek = usePlayerStore((s) => s.seek);
  const progress = usePlayerStore((s) => s.progress);
  const theme = useTheme();

  const colors = useMemo(
    (): SpectrogramColors => ({
      played: theme.palette.primary.main,
      unplayed: theme.palette.default.main,
      background: theme.palette.background.default,
    }),
    [theme],
  );

  const parameters = useMemo((): SpectrogramParameters | undefined => {
    if (!buffer) return;
    return {
      windowSize: 2048,
      sampleRate: buffer.sampleRate,
      minFrequency: buffer.sampleRate * 0.001,
      maxFrequency: buffer.sampleRate * 0.1,
    };
  }, [buffer]);

  return (
    <Box height='512px' width='100%'>
      {buffer && parameters && (
        <Spectrogram
          buffer={buffer.getChannelData(0)}
          parameters={parameters}
          progress={progress}
          onSeek={seek}
          colors={colors}
        />
      )}
    </Box>
  );
};
