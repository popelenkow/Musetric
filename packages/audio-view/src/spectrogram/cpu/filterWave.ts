export const filterWave = (
  windowSize: number,
  windowCount: number,
  data: Float32Array,
): void => {
  const coefficient = new Float32Array(windowSize);
  for (let i = 0; i < windowSize; i++) {
    coefficient[i] = 0.54 - 0.46 * Math.cos((Math.PI * 2 * i) / (windowSize - 1));
  }
  for (let w = 0; w < windowCount; w++) {
    const offset = w * windowSize;
    for (let i = 0; i < windowSize; i++) {
      data[offset + i] *= coefficient[i];
    }
  }
};

export const createFilterWave = () => filterWave;
