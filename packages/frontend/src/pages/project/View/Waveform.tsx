import { type api } from '@musetric/api';
import { type FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ErrorView } from '../components/ErrorView.js';
import { LoadingView } from '../components/LoadingView.js';
import { usePlayerStore } from '../store/player.js';
import { useWaveformStore } from '../store/waveform.js';

export type WaveformProps = {
  projectId: number;
  type: api.wave.Type;
};

export const Waveform: FC<WaveformProps> = (props) => {
  const { projectId, type } = props;
  const { t } = useTranslation();

  const [canvas, setCanvas] = useState<HTMLCanvasElement | null>();
  const seek = usePlayerStore((s) => s.seek);
  const mount = useWaveformStore((s) => s.mount);
  const attachCanvas = useWaveformStore((s) => s.attachCanvas);
  const status = useWaveformStore((s) => s.status);

  useEffect(() => {
    return mount(projectId, type);
  }, [mount, projectId, type]);

  useEffect(() => {
    if (status !== 'success' || !canvas) return;
    attachCanvas(canvas);
  }, [attachCanvas, canvas, status]);

  if (status === 'pending') {
    return <LoadingView />;
  }

  if (status === 'error') {
    return <ErrorView message={t('pages.project.progress.error.waveform')} />;
  }

  return (
    <canvas
      ref={setCanvas}
      style={{ height: '100%', width: '100%', display: 'block' }}
      onClick={async (event) => {
        const targetCanvas = event.currentTarget;
        const rect = targetCanvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        await seek(x / targetCanvas.clientWidth);
      }}
    />
  );
};
