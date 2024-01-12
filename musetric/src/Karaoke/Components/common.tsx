export const windowSize = 1024;
export const frequencySize = windowSize / 2;
export const width = 512;
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

export const setSinus = (result: Float32Array, phase: number): void => {
    const size = result.length;
    for (let i = 0; i < result.length; i++) {
        const time = i / sampleRate;
        const inc = 1 + Math.floor((i / size) * width) / (width - 1);
        const fact = 1 + phase * 2500 / sampleRate;
        result[i] = Math.sin(2 * Math.PI * frequency * fact * inc * time);
    }
};
