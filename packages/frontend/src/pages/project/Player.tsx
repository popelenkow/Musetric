import PauseIcon from '@mui/icons-material/Pause';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { Box, IconButton, Stack } from '@mui/material';
import { FC, useEffect, useRef, useState } from 'react';
import WaveSurfer from 'wavesurfer.js';

export type PlayerProps = {
  blob: Blob;
};

export const Player: FC<PlayerProps> = (props) => {
  const { blob } = props;
  const containerRef = useRef<HTMLDivElement>(null);
  const wavesurferRef = useRef<WaveSurfer | null>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;
    const ws = WaveSurfer.create({
      container: containerRef.current,
      height: 64,
      waveColor: '#9e9e9e',
      progressColor: '#1976d2',
    });
    wavesurferRef.current = ws;
    ws.loadBlob(blob);
    ws.on('finish', () => setPlaying(false));
    return () => {
      ws.destroy();
    };
  }, [blob]);

  const toggle = () => {
    const ws = wavesurferRef.current;
    if (!ws) return;
    ws.playPause();
    setPlaying(ws.isPlaying());
  };

  return (
    <Stack direction='row' alignItems='center' gap={1} sx={{ width: '100%' }}>
      <Box sx={{ flex: 1 }}>
        <div ref={containerRef} />
      </Box>
      <IconButton onClick={toggle}>
        {playing ? <PauseIcon /> : <PlayArrowIcon />}
      </IconButton>
    </Stack>
  );
};
