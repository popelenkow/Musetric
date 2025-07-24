import { useTheme } from '@mui/material';
import { spectrogram, subscribeResizeObserver } from '@musetric/audio-view';
import { FC, useEffect, useRef } from 'react';
import { usePlayerStore } from './store/player';
import { useSettingsStore } from './store/settings';
import { useSpectrogramStore } from './store/spectogram';

export const Spectrogram: FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const theme = useTheme();

  const buffer = usePlayerStore((s) => s.buffer);
  const seek = usePlayerStore((s) => s.seek);
  const progress = usePlayerStore((s) => s.progress);

  const windowSize = useSettingsStore((s) => s.windowSize);
  const fourierMode = useSettingsStore((s) => s.fourierMode);
  const minFrequency = useSettingsStore((s) => s.minFrequency);
  const maxFrequency = useSettingsStore((s) => s.maxFrequency);
  const minDecibel = useSettingsStore((s) => s.minDecibel);

  const pipeline = useSpectrogramStore((s) => s.pipeline);
  const mount = useSpectrogramStore((s) => s.mount);
  const unmount = useSpectrogramStore((s) => s.unmount);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !buffer) return;
    mount(canvas, fourierMode);
  }, [mount, canvasRef, fourierMode, buffer]);

  useEffect(() => {
    return unmount;
  }, [unmount]);

  useEffect(() => {
    if (!pipeline || !buffer) return;
    const data = buffer.getChannelData(0);
    const { sampleRate } = buffer;
    const colors: spectrogram.Colors = {
      played: theme.palette.primary.main,
      unplayed: theme.palette.default.main,
      background: theme.palette.background.default,
    };
    const configureOptions: spectrogram.PipelineConfigureOptions = {
      windowSize,
      colors,
      sampleRate,
      minFrequency,
      maxFrequency,
      minDecibel,
    };
    pipeline.configure(configureOptions);
    void pipeline.render(data, progress);
  }, [
    pipeline,
    buffer,
    theme,
    windowSize,
    minFrequency,
    maxFrequency,
    minDecibel,
    progress,
  ]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !pipeline || !buffer) return;
    const data = buffer.getChannelData(0);
    return subscribeResizeObserver(canvas, async () => {
      pipeline.resize();
      await pipeline.render(data, progress);
    });
  }, [pipeline, buffer, progress]);

  return (
    <canvas
      key={fourierMode}
      ref={canvasRef}
      style={{ width: '100%', height: '100%', display: 'block' }}
      onClick={async (event) => {
        const canvas = event.currentTarget;
        const rect = canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        await seek(x / canvas.clientWidth);
      }}
    />
  );
};
