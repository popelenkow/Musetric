export const decibelify = (
  windowSize: number,
  windowCount: number,
  magnitudes: Float32Array,
  minDecibel: number,
): void => {
  const halfSize = windowSize / 2;

  const epsilon = 1e-12;
  const decibelFactor = (20 * Math.LOG10E) / -minDecibel;

  for (let windowIndex = 0; windowIndex < windowCount; windowIndex++) {
    const windowOffset = windowIndex * halfSize;
    let maxMagnitude = 0;
    for (let i = 0; i < halfSize; i++) {
      const amplitude = magnitudes[windowOffset + i];
      if (amplitude > maxMagnitude) maxMagnitude = amplitude;
    }

    const inverseMax = 1 / maxMagnitude;
    for (let i = 0; i < halfSize; i++) {
      const idx = windowOffset + i;
      const magnitude = magnitudes[idx] * inverseMax + epsilon;
      const decibel = Math.log(magnitude) * decibelFactor + 1;
      magnitudes[idx] = decibel > 0 ? decibel : 0;
    }
  }
};

export type Decibelify = typeof decibelify;
export const createDecibelify = (): Decibelify => decibelify;
