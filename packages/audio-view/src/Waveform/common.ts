export type WaveSegment = { min: number; max: number };

export const generateSegments = (
  data: Float32Array,
  width: number,
): WaveSegment[] => {
  const step = data.length / width;
  const segments: WaveSegment[] = [];
  for (let i = 0; i < width; i++) {
    const start = Math.floor(i * step);
    const end = Math.min(Math.floor((i + 1) * step), data.length);
    let min = 1;
    let max = -1;
    for (let j = start; j < end; j++) {
      const value = data[j];
      if (value < min) min = value;
      if (value > max) max = value;
    }
    segments.push({ min, max });
  }
  return segments;
};

export const drawWaveform = (
  canvas: HTMLCanvasElement,
  segments: WaveSegment[],
  progress: number,
  colors: { played: string; unplayed: string },
) => {
  const width = canvas.clientWidth;
  const height = canvas.height;
  canvas.width = width;
  const context = canvas.getContext('2d');
  if (!context) return;
  context.clearRect(0, 0, width, height);

  const clampedProgress = Math.max(0, Math.min(progress, 1));
  const playedCount = Math.floor(clampedProgress * segments.length);

  context.strokeStyle = colors.unplayed;
  context.beginPath();
  for (let i = 0; i < segments.length; i++) {
    const { min, max } = segments[i];
    context.moveTo(i, height * ((1 - max) / 2));
    context.lineTo(i, height * ((1 - min) / 2));
  }
  context.stroke();

  context.strokeStyle = colors.played;
  context.beginPath();
  for (let i = 0; i < playedCount; i++) {
    const { min, max } = segments[i];
    context.moveTo(i, height * ((1 - max) / 2));
    context.lineTo(i, height * ((1 - min) / 2));
  }
  context.stroke();
};
