export type WaveSegment = {
  min: number;
  max: number;
};

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
