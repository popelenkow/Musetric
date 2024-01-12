import { Theme } from '../AppBase/Theme';
import { RealArray } from '../TypedArray/RealArray';
import { parseTheme, gradientUint32ByRgb } from './Color';
import { NumberRange, Size2D } from './Layout';

export type SpectrogramColors = {
    gradient: Uint32Array,
};
export const createSpectrogramColors = (theme: Theme): SpectrogramColors => {
    const { background, content } = parseTheme('rgb', theme);
    const gradient = gradientUint32ByRgb(background, content, 256);
    return { gradient };
};

export type DrawSpectrogramOptions = {
    input: RealArray<'uint8'>[],
    output: Uint8ClampedArray,
    frame: Size2D,
    colors: SpectrogramColors,
    frequencyRange: NumberRange,
    sampleRate: number,
};
export const drawSpectrogram = (options: DrawSpectrogramOptions): void => {
    const { input, output, frame, colors, frequencyRange, sampleRate } = options;
    const { gradient } = colors;
    const out = new Uint32Array(output.buffer);

    const stepY = input.length / frame.height;
    let index = 0;
    let offsetY = 0;
    for (let y = 0; y < frame.height; y++) {
        const spectrum = input[Math.floor(offsetY)].real;
        const fromX = (frequencyRange.from / sampleRate) * 2 * spectrum.length;
        const toX = (frequencyRange.to / sampleRate) * 2 * spectrum.length;
        const stepX = (toX - fromX) / frame.width;
        let offsetX = fromX;
        for (let x = 0; x < frame.width; x++) {
            const colorIndex = spectrum[Math.floor(offsetX)];
            out[index] = gradient[colorIndex];
            index++;
            offsetX += stepX;
        }
        offsetY += stepY;
    }
};
