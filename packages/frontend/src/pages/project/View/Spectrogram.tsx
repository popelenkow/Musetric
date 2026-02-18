import { type FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ErrorView } from '../components/ErrorView.js';
import { LoadingView } from '../components/LoadingView.js';
import { usePlayerStore } from '../store/player.js';
import { useSettingsStore } from '../store/settings.js';
import { useSpectrogramStore } from '../store/spectrogram.js';

export type SpectrogramProps = {
  status: 'pending' | 'error' | 'success';
};
export const Spectrogram: FC<SpectrogramProps> = (props) => {
  const { status } = props;
  const { t } = useTranslation();
  const [canvas, setCanvas] = useState<HTMLCanvasElement | null>();
  const seek = usePlayerStore((s) => s.seek);
  const playerStatus = usePlayerStore((s) => s.status);
  const fourierMode = useSettingsStore((s) => s.fourierMode);
  const mount = useSpectrogramStore((s) => s.mount);

  useEffect(() => {
    if (!canvas) return;
    return mount(canvas);
  }, [mount, canvas]);

  if (status === 'error') {
    return <ErrorView message={t('pages.project.progress.error.audioTrack')} />;
  }

  if (status === 'pending' || playerStatus === 'pending') {
    return <LoadingView />;
  }

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
