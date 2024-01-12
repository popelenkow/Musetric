/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/consistent-type-assertions */
/* eslint-disable @typescript-eslint/explicit-function-return-type */

import { createFftRadix4 } from '../../../Sounds/FftRadix4';
import { viewRealArray } from '../../../TypedArray/RealArray';
import { check, createSinus, frequencySize, width, windowSize } from './common';

export const createCpuFft = () => {
    const input = createSinus();
    const output = new Float32Array(frequencySize * width);
    const fft = createFftRadix4(windowSize);

    return {
        render: () => {
            console.time('cpuFftJ');
            for (let k = 0; k < width; k++) {
                const i = viewRealArray('float32', input.buffer, k * windowSize, windowSize);
                const o = viewRealArray('float32', output.buffer, k * frequencySize, frequencySize);
                fft.frequency(i, o, { convert: (x) => x });
            }
            console.timeEnd('cpuFftJ');
            check(output);
        },
    };
};
