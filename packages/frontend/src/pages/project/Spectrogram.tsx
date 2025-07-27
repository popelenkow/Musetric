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
  const setViewSize = useSpectrogramStore((s) => s.setViewSize);

  useEffect(() => {
    if (!canvas) return;
    mount(canvas);
  }, [mount, setViewSize, canvas]);

  useEffect(() => {
    return unmount;
  }, [unmount]);

  return (
    <canvas
      key={fourierMode}
      ref={setCanvas}
      style={{ width: '100%', height: '100%', display: 'block' }}
      onClick={async (event) => {
        const targetCanvas = event.currentTarget;
        const rect = targetCanvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        await seek(x / targetCanvas.clientWidth);
      }}
    />
  );
};
