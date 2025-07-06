import PauseIcon from '@mui/icons-material/Pause';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { Stack, Slider, IconButton } from '@mui/material';
import { FC, useState, useRef, useEffect } from 'react';

export type SongPlayerProps = {
  url: string;
};
export const SongPlayer: FC<SongPlayerProps> = (props) => {
  const { url } = props;
  const audioRef = useRef<HTMLAudioElement>(undefined);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const audio = new Audio(url);
    audioRef.current = audio;

    const onTimeUpdate = () => {
      const duration = audio.duration || 1;
      setProgress((audio.currentTime / duration) * 100);
    };

    audio.addEventListener('timeupdate', onTimeUpdate);
    return () => {
      audio.pause();
      audio.removeEventListener('timeupdate', onTimeUpdate);
    };
  }, [url]);

  return (
    <Stack direction='row' alignItems='center' gap={1} sx={{ mt: 2 }}>
      <Slider
        size='small'
        sx={{ flex: 1 }}
        value={progress}
        onChange={(_, value) => {
          if (!audioRef.current) return;
          const duration = audioRef.current.duration || 1;
          audioRef.current.currentTime = (value / 100) * duration;
        }}
      />
      <IconButton
        onClick={() => {
          if (!audioRef.current) return;
          if (playing) audioRef.current.pause();
          else void audioRef.current.play();
          setPlaying(!playing);
        }}
      >
        {playing ? <PauseIcon /> : <PlayArrowIcon />}
      </IconButton>
    </Stack>
  );
};
