import { FC, useEffect, useState } from 'react';
import { usePlayerStore } from '../store/player.js';
import { useWaveformStore } from '../store/waveform.js';

export const Waveform: FC = () => {
  const [canvas, setCanvas] = useState<HTMLCanvasElement | null>();
  const seek = usePlayerStore((s) => s.seek);
  const mount = useWaveformStore((s) => s.mount);

  useEffect(() => {
    if (!canvas) return;
    return mount(canvas);
  }, [mount, canvas]);

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
