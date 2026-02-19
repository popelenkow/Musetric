import PauseIcon from '@mui/icons-material/Pause';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { IconButton } from '@mui/material';
import { type FC } from 'react';
import { usePlayerStore } from './store.js';

export const Player: FC = () => {
  const playing = usePlayerStore((s) => s.playing);
  const buffer = usePlayerStore((s) => s.buffer);
  const play = usePlayerStore((s) => s.play);
  const pause = usePlayerStore((s) => s.pause);

  return (
    <IconButton
      onClick={playing ? pause : play}
      disabled={!buffer}
      sx={{ alignSelf: 'center' }}
    >
      {playing ? <PauseIcon /> : <PlayArrowIcon />}
    </IconButton>
  );
};
