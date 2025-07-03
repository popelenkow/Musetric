import { Box, useTheme } from '@mui/material';
import { FourierMode, spectrogram, Spectrogram } from '@musetric/audio-view';
import { FC, useMemo } from 'react';
import { usePlayerStore } from './store';

export const fourierMode: FourierMode = 'fftRadix2Gpu';

export const PlayerSpectrogram: FC = () => {
  const buffer = usePlayerStore((s) => s.buffer);
  const seek = usePlayerStore((s) => s.seek);
  const progress = usePlayerStore((s) => s.progress);
  const theme = useTheme();

  const colors = useMemo(
    (): spectrogram.Colors => ({
      played: theme.palette.primary.main,
      unplayed: theme.palette.default.main,
      background: theme.palette.background.default,
    }),
    [theme],
  );

  const gradients: spectrogram.Gradients = useMemo(
    () => ({
      played: spectrogram.createGradient(
        spectrogram.parseHexColor(colors.background),
        spectrogram.parseHexColor(colors.played),
      ),
      unplayed: spectrogram.createGradient(
        spectrogram.parseHexColor(colors.background),
        spectrogram.parseHexColor(colors.unplayed),
      ),
    }),
    [colors],
  );

  const parameters = useMemo((): spectrogram.Parameters | undefined => {
    if (!buffer) return;
    return {
      windowSize: 1024 * 16,
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
          gradients={gradients}
          fourierMode={fourierMode}
        />
      )}
    </Box>
  );
};
