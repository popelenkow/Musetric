export const calcMagnitudeToNormalizedDecibel = (
  magnitudes: Float32Array,
  minDecibel = -40,
): void => {
  let maxMagnitude = 0;
  for (let i = 0; i < magnitudes.length; i++) {
    const amplitude = magnitudes[i];
    if (amplitude > maxMagnitude) maxMagnitude = amplitude;
  }

  const epsilon = 1e-12;
  const inverseMax = 1 / maxMagnitude;
  const decibelFactor = (20 * Math.LOG10E) / -minDecibel;

  for (let i = 0; i < magnitudes.length; i++) {
    const normalizedMagnitude = magnitudes[i] * inverseMax + epsilon;
    const normalizedDecibel = Math.log(normalizedMagnitude) * decibelFactor + 1;
    magnitudes[i] = normalizedDecibel > 0 ? normalizedDecibel : 0;
  }
};
