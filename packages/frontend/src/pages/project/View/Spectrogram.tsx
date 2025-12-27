import { FC, useEffect, useRef } from 'react';
import { usePlayerStore } from '../store/player.js';
import { useSettingsStore } from '../store/settings.js';
import { useSpectrogramStore } from '../store/spectrogram.js';

export const Spectrogram: FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const seek = usePlayerStore((s) => s.seek);
  const fourierMode = useSettingsStore((s) => s.fourierMode);
  const mount = useSpectrogramStore((s) => s.mount);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    return mount(canvas);
  }, [mount]);

  return (
    <canvas
      key={fourierMode}
      ref={canvasRef}
      style={{ width: '100%', height: '100%', display: 'block' }}
      onClick={async (event) => {
        const { visibleTimeBefore, visibleTimeAfter } =
          useSettingsStore.getState();
        const { progress, buffer, sampleRate } = usePlayerStore.getState();

        if (!buffer || !sampleRate) {
          return;
        }

        const targetCanvas = event.currentTarget;
        const rect = targetCanvas.getBoundingClientRect();
        const clickX = event.clientX - rect.left;
        const clickRatio = clickX / targetCanvas.clientWidth;

        const totalVisibleTime = visibleTimeBefore + visibleTimeAfter;
        const timelineRatio = visibleTimeBefore / totalVisibleTime;
        const clickOffsetRatio = clickRatio - timelineRatio;
        const timeOffset = totalVisibleTime * sampleRate * clickOffsetRatio;
        const progressOffset = timeOffset / buffer.length;

        const newProgress = Math.min(1, Math.max(0, progress + progressOffset));

        await seek(newProgress);
      }}
    />
  );
};
