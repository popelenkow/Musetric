/* Licensed by MIT. Based on https://github.com/corbanbrook/dsp.js/tree/c6144fcd75b65f72eac4791ab9f7268a814f44a8 */

export const zeroWindowFilter = (windowSize: number): Float32Array => {
  const filter = new Float32Array(windowSize);
  for (let i = 0; i < windowSize; i++) {
    filter[i] = 0;
  }
  return filter;
};

export const bartlettWindowFilter = (windowSize: number): Float32Array => {
  const filter = new Float32Array(windowSize);
  const last = windowSize - 1;
  for (let i = 0; i < windowSize; i++) {
    filter[i] = (2 / last) * (last / 2 - Math.abs(i - last / 2));
  }
  return filter;
};
export const bartlettHannWindowFilter = (windowSize: number): Float32Array => {
  const filter = new Float32Array(windowSize);
  const last = windowSize - 1;
  for (let i = 0; i < windowSize; i++) {
    filter[i] = (2 / last) * (last / 2 - Math.abs(i - last / 2));
  }
  return filter;
};

export const blackmanWindowFilter = (windowSize: number): Float32Array => {
  const filter = new Float32Array(windowSize);
  const last = windowSize - 1;
  const alpha = 0.16;
  for (let i = 0; i < windowSize; i++) {
    const n = (2 * Math.PI * i) / last;
    const k = (4 * Math.PI * i) / last;
    filter[i] = (1 - alpha) / 2 - 0.5 * Math.cos(n) + (alpha / 2) * Math.cos(k);
  }
  return filter;
};

export const cosineWindowFilter = (windowSize: number): Float32Array => {
  const filter = new Float32Array(windowSize);
  for (let i = 0; i < windowSize; i++) {
    filter[i] = Math.cos((Math.PI * i) / (windowSize - 1) - Math.PI / 2);
  }
  return filter;
};

export const gaussWindowFilter = (windowSize: number): Float32Array => {
  const filter = new Float32Array(windowSize);
  const alpha = 0.25;
  for (let i = 0; i < windowSize; i++) {
    const r1 = (i - (windowSize - 1) / 2) / ((alpha * (windowSize - 1)) / 2);
    filter[i] = Math.E ** (-0.5 * r1 ** 2);
  }
  return filter;
};

export const hammingWindowFilter = (windowSize: number): Float32Array => {
  const filter = new Float32Array(windowSize);
  for (let i = 0; i < windowSize; i++) {
    filter[i] = 0.54 - 0.46 * Math.cos((Math.PI * 2 * i) / (windowSize - 1));
  }
  return filter;
};

export const hannWindowFilter = (windowSize: number): Float32Array => {
  const filter = new Float32Array(windowSize);
  for (let i = 0; i < windowSize; i++) {
    filter[i] = 0.5 * (1 - Math.cos((Math.PI * 2 * i) / (windowSize - 1)));
  }
  return filter;
};

export const lanczozWindowFilter = (windowSize: number): Float32Array => {
  const filter = new Float32Array(windowSize);
  const last = windowSize - 1;
  for (let i = 0; i < windowSize; i++) {
    filter[i] =
      Math.sin(Math.PI * ((2 * i) / last - 1)) /
      (Math.PI * ((2 * i) / last - 1));
  }
  return filter;
};

export const rectangularWindowFilter = (windowSize: number): Float32Array => {
  const filter = new Float32Array(windowSize);
  for (let i = 0; i < windowSize; i++) {
    filter[i] = 1;
  }
  return filter;
};

export const triangularWindowFilter = (windowSize: number): Float32Array => {
  const filter = new Float32Array(windowSize);
  for (let i = 0; i < windowSize; i++) {
    filter[i] =
      (2 / windowSize) * (windowSize / 2 - Math.abs(i - (windowSize - 1) / 2));
  }
  return filter;
};
