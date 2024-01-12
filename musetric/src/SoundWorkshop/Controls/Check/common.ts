import referenceJson from './result.json';

// eslint-disable-next-line @typescript-eslint/consistent-type-assertions
const reference = referenceJson as unknown as number[];

export const windowSize = 2048;
export const frequencySize = windowSize / 2;
export const width = 1024;
export const frequency = 440;
export const sampleRate = 44100;
export const workgroupSize = 64;
export const textureSize: GPUExtent3DStrict = {
    width,
    height: frequencySize,
    depthOrArrayLayers: 1,
};

export const createSinus = (): Float32Array => {
    const size = width * windowSize;

    const result = new Float32Array(size);

    for (let i = 0; i < result.length; i++) {
        const time = i / sampleRate;
        const inc = 1 + Math.floor((i / size) * width) / (width - 1);
        result[i] = Math.sin(2 * Math.PI * frequency * inc * time);
    }
    return result;
};

export const check = (output: Float32Array): void => {
    let j = 0;
    for (let i = 0; i < output.length; i++) {
        const r = reference[i];
        const o = output[i];
        const diff = Math.abs(r - o);
        const onePercentOfLarger = 0.1 * Math.max(Math.abs(r), Math.abs(o));
        if (diff > onePercentOfLarger) {
            console.error(`${i}: ${r} !== ${o}`);
            j++;
            if (j === 5) {
                console.log(Array.from(output));
                return;
            }
        }
    }
};
