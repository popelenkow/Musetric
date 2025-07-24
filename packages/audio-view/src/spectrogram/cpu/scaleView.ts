export const scaleView = (
  windowSize: number,
  windowCount: number,
  height: number,
  sampleRate: number,
  minFrequency: number,
  maxFrequency: number,
  magnitudes: Float32Array,
  view: Uint8Array,
) => {
  const halfSize = windowSize / 2;
  const maxBin = Math.min(
    Math.floor((maxFrequency / sampleRate) * windowSize),
    halfSize,
  );
  const minBin = Math.max(
    Math.floor((minFrequency / sampleRate) * windowSize),
    0,
  );
  const logMin = Math.log(minBin + 1);
  const logRange = Math.log(maxBin + 1) - logMin;

  for (let x = 0; x < windowCount; x++) {
    const windowOffset = x * halfSize;
    const columnOffset = x * height;
    for (let y = 0; y < height; y++) {
      const ratio = 1 - y / (height - 1);
      const raw = Math.exp(logMin + logRange * ratio);
      const idx = Math.max(minBin, Math.min(Math.floor(raw) - 1, maxBin - 1));
      const magnitude = magnitudes[windowOffset + idx];
      view[columnOffset + y] = Math.round(magnitude * 255);
    }
  }
};

export type ScaleView = {
  run: (magnitudes: Float32Array, view: Uint8Array) => void;
  configure: (
    windowSize: number,
    windowCount: number,
    height: number,
    sampleRate: number,
    minFrequency: number,
    maxFrequency: number,
  ) => void;
};
export const createScaleView = (): ScaleView => {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  let windowSize: number = undefined!;
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  let windowCount: number = undefined!;
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  let height: number = undefined!;
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  let sampleRate: number = undefined!;
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  let minFrequency: number = undefined!;
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  let maxFrequency: number = undefined!;

  return {
    run: (magnitudes, view) =>
      scaleView(
        windowSize,
        windowCount,
        height,
        sampleRate,
        minFrequency,
        maxFrequency,
        magnitudes,
        view,
      ),
    configure: (
      newWindowSize,
      newWindowCount,
      newHeight,
      newSampleRate,
      newMinFrequency,
      newMaxFrequency,
    ) => {
      windowSize = newWindowSize;
      windowCount = newWindowCount;
      height = newHeight;
      sampleRate = newSampleRate;
      minFrequency = newMinFrequency;
      maxFrequency = newMaxFrequency;
    },
  };
};
