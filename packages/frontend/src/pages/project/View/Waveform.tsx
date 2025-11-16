import { FC, useEffect, useState } from 'react';
import { usePlayerStore } from '../store/player.js';
import { useWaveformStore } from '../store/waveform.js';

export const Waveform: FC = () => {
  const [canvas, setCanvas] = useState<HTMLCanvasElement | null>();
  const seek = usePlayerStore((s) => s.seek);
  const mount = useWaveformStore((s) => s.mount);
  const unmount = useWaveformStore((s) => s.unmount);

  useEffect(() => {
    if (!canvas) return;
    mount(canvas);
  }, [mount, canvas]);

  useEffect(() => {
    return unmount;
  }, [unmount]);

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
