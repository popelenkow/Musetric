export type WaveSegment = {
  min: number;
  max: number;
};

export const generateSegments = (
  data: Float32Array<ArrayBuffer>,
  width: number,
): WaveSegment[] => {
  const sourceCount = Math.floor(data.length / 2);
  if (width <= 0 || sourceCount <= 0) {
    return [];
  }

  const step = sourceCount / width;
  const segments: WaveSegment[] = [];

  if (step < 1) {
    for (let i = 0; i < width; i += 1) {
      const sourceIndex = Math.min(sourceCount - 1, Math.floor(i * step));
      const min = data[sourceIndex * 2];
      const max = data[sourceIndex * 2 + 1];
      segments.push({ min, max });
    }
    return segments;
  }

  for (let i = 0; i < width; i += 1) {
    const start = Math.floor(i * step);
    const end = Math.min(Math.floor((i + 1) * step), sourceCount);
    let sumMin = 0;
    let sumMax = 0;
    let count = 0;
    for (let j = start; j < end; j += 1) {
      sumMin += data[j * 2];
      sumMax += data[j * 2 + 1];
      count += 1;
    }
    if (count === 0) {
      segments.push({ min: 0, max: 0 });
    } else {
      segments.push({
        min: sumMin / count,
        max: sumMax / count,
      });
    }
  }
  return segments;
};
