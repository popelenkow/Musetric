import PauseIcon from '@mui/icons-material/Pause';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { IconButton } from '@mui/material';
import { FC } from 'react';
import { usePlayerStore } from './store/player.js';

export const Player: FC = () => {
  const playing = usePlayerStore((s) => s.playing);
  const play = usePlayerStore((s) => s.play);
  const pause = usePlayerStore((s) => s.pause);

  return (
    <IconButton onClick={playing ? pause : play} sx={{ alignSelf: 'center' }}>
      {playing ? <PauseIcon /> : <PlayArrowIcon />}
    </IconButton>
  );
};
