import { Box } from '@mui/material';
import { Spectrogram } from '@musetric/audio-view';
import { FC } from 'react';
import { usePlayerStore } from './store';

export const PlayerSpectrogram: FC = () => {
  const buffer = usePlayerStore((s) => s.buffer);

  return (
    <Box height='512px' width='100%'>
      {buffer && (
        <Spectrogram
          buffer={buffer?.getChannelData(0)}
          windowSize={16384}
          cutoffRatio={0.2}
        />
      )}
    </Box>
  );
};
