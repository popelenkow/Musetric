import { FC, useEffect, useState } from 'react';
import { usePlayerStore } from './store/player';
import { useSettingsStore } from './store/settings';
import { useSpectrogramStore } from './store/spectrogram';

export const Spectrogram: FC = () => {
  const [canvas, setCanvas] = useState<HTMLCanvasElement | null>();
  const seek = usePlayerStore((s) => s.seek);
  const fourierMode = useSettingsStore((s) => s.fourierMode);
  const mount = useSpectrogramStore((s) => s.mount);
  const unmount = useSpectrogramStore((s) => s.unmount);

  useEffect(() => {
    if (!canvas) return;
    mount(canvas);
  }, [mount, canvas]);

  useEffect(() => {
    return unmount;
  }, [unmount]);

  return (
    <canvas
      key={fourierMode}
      ref={setCanvas}
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
