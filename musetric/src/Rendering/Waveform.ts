import { Theme } from '../AppBase/Theme';
import { parseTheme } from './Color';
import { Size2D } from './Layout';

export type Waves = {
    minArray: Float32Array,
    maxArray: Float32Array,
};

export const evalWaves = (
    input: Float32Array,
    output: Waves,
    frame: Size2D,
): void => {
    const { minArray, maxArray } = output;
    const window = input.length / frame.height;
    const step = Math.max(1, Math.round(window / 20));
    for (let y = 0; y < frame.height; y++) {
        let min = 1.0;
        let max = -1.0;
        const offset = Math.floor(y * window);
        for (let i = 0; i < window; i += step) {
            const value = input[offset + i];
            if (value < min) min = value;
            if (value > max) max = value;
        }
        minArray[y] = min;
        maxArray[y] = max;
    }

    for (let y = 0; y < frame.height; y++) {
        minArray[y] = (1 + minArray[y]) * (frame.width / 2);
        maxArray[y] = (1 + maxArray[y]) * (frame.width / 2);
    }
};

export type WaveformColors = {
    content: number,
    background: number,
};
export const createWaveformColors = (theme: Theme): WaveformColors => {
    const { content, background } = parseTheme('uint32', theme);
    return { content, background };
};

export const drawWaveform = (
    input: Waves,
    output: Uint8ClampedArray,
    frame: Size2D,
    colors: WaveformColors,
): void => {
    const { content, background } = colors;
    const { minArray, maxArray } = input;
    const out = new Uint32Array(output.buffer);

    for (let y = 0; y < frame.height; y++) {
        const min = Math.ceil(minArray[y]);
        const max = Math.ceil(maxArray[y]);
        const index = y * frame.width;
        out.fill(background, index, index + min);
        out.fill(content, index + min, index + max);
        out.fill(background, index + max, index + frame.width);
    }
};
