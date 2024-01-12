/* eslint-disable no-mixed-operators */
/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/explicit-function-return-type */

import { createComplexArray } from '../../../TypedArray/ComplexArray';
import { check, createSinus, frequencySize, width, windowSize } from './common';

export const createCpuDft = () => {
    const input = createSinus();
    const output = new Float32Array(frequencySize * width);

    const table = {
        cos: Array.from({ length: windowSize }).map((_, i) => Math.cos((-2 * Math.PI * i) / windowSize)),
        sin: Array.from({ length: windowSize }).map((_, i) => Math.sin((-2 * Math.PI * i) / windowSize)),
    };

    const getBitReverse = () => {
        const result = new Array<number>(windowSize);
        let j = 0;
        for (let i = 0; i < windowSize; i++) {
            result[i] = j;
            let m = windowSize >> 1;
            while (m >= 1 && j >= m) {
                j -= m;
                m >>= 1;
            }
            j += m;
        }
        return result;
    };
    const bitReverse = getBitReverse();

    const cosSinTable = new Array<{ cos: number, sin: number }>(windowSize / 2);
    for (let i = 0; i < windowSize / 2; i++) {
        const angle = -2 * Math.PI * i / windowSize;
        cosSinTable[i] = { cos: Math.cos(angle), sin: Math.sin(angle) };
    }

    const array = createComplexArray('float32', windowSize);
    const realPart = new Float32Array(windowSize);
    const imagPart = new Float32Array(windowSize);

    const fft = () => {
        for (let line = 0; line < width; line++) {
            const inputOffset = line * windowSize;
            const outputOffset = line * frequencySize;

            // Bit-reversal permutation
            for (let i = 0; i < windowSize; i++) {
                const reversedIndex = bitReverse[i];
                realPart[i] = input[inputOffset + reversedIndex];
                imagPart[i] = 0;
            }

            // Cooley-Tukey FFT
            for (let size = 2; size <= windowSize; size <<= 1) {
                const halfSize = size >> 1;
                const tableStep = windowSize / size;
                for (let m = 0; m < windowSize; m += size) {
                    for (let k = 0; k < halfSize; k++) {
                        const tableIndex = k * tableStep;
                        const { cos } = cosSinTable[tableIndex];
                        const { sin } = cosSinTable[tableIndex];

                        const i = m + k;
                        const j = i + halfSize;

                        const tReal = cos * realPart[j] - sin * imagPart[j];
                        const tImag = sin * realPart[j] + cos * imagPart[j];

                        const uReal = realPart[i];
                        const uImag = imagPart[i];

                        realPart[i] = uReal + tReal;
                        imagPart[i] = uImag + tImag;
                        realPart[j] = uReal - tReal;
                        imagPart[j] = uImag - tImag;
                    }
                }
            }
            for (let i = 0; i < frequencySize; i++) {
                const real = realPart[i];
                const imag = imagPart[i];
                const value = Math.sqrt(real * real + imag * imag);
                output[outputOffset + i] = 2 * value / windowSize;
            }
        }
    };

    const dft = () => {
        for (let i = 0; i < width; i++) {
            const inputOffset = windowSize * i;
            const outputOffset = frequencySize * i;
            for (let frequency = 0; frequency < frequencySize; frequency++) {
                let real = 0;
                let imag = 0;

                for (let n = 0; n < windowSize; n++) {
                    const phiIndex = (frequency * n) % windowSize;
                    const value = input[inputOffset + n];
                    real += value * table.cos[phiIndex];
                    imag += value * table.sin[phiIndex];
                }

                const result = Math.sqrt(real * real + imag * imag) / frequencySize;
                output[outputOffset + frequency] = result;
            }
        }
    };

    return {
        render: () => {
            console.time('cpuDftJ');
            fft();
            console.timeEnd('cpuDftJ');
            check(output);
        },
    };
};
