import { ComplexIndexable } from '../TypedArray/ComplexIndexable';
import { SpectrometerBase, createSpectrometer, Spectrometer } from './Spectrometer';

const transform = (
    input: ComplexIndexable,
    output: ComplexIndexable,
    windowSize: number,
    isInverse: boolean,
): void => {
    for (let i = 0; i < windowSize; i++) {
        output.real[i] = 0;
        output.imag[i] = 0;
    }

    const pi2 = isInverse ? Math.PI * 2 : Math.PI * (-2);
    const invWindowSize = 1 / windowSize;
    for (let k = 0; k < windowSize; k++) {
        for (let i = 0; i < windowSize; i++) {
            const theta = pi2 * k * i * invWindowSize;
            const cos = Math.cos(theta);
            const sin = Math.sin(theta);
            const real = input.real[i];
            const imag = input.imag[i];
            output.real[k] += real * cos - imag * sin;
            output.imag[k] += real * sin + imag * cos;
        }
    }

    if (isInverse) {
        for (let i = 0; i < windowSize; i++) {
            output.real[i] *= invWindowSize;
            output.imag[i] *= invWindowSize;
        }
    }
};

export type DftFrequencyOptions = {
    offset: number,
};

export type DftFrequenciesOptions = {
    offset: number,
    step: number,
    count: number,
};

export const createDftBase = (windowSize: number): SpectrometerBase => {
    const api: SpectrometerBase = {
        forward: (input: ComplexIndexable, output: ComplexIndexable) => {
            transform(input, output, windowSize, false);
        },
        inverse: (input: ComplexIndexable, output: ComplexIndexable) => {
            transform(input, output, windowSize, true);
        },
    };
    return api;
};

export const createDft = (windowSize: number): Spectrometer => {
    const base = createDftBase(windowSize);
    const api: Spectrometer = createSpectrometer(windowSize, base);
    return api;
};
