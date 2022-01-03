import { RealArray } from '../TypedArray/RealArray';
import { Theme } from '../AppBase/Theme';
import type { SoundParameters } from '../Workshop/SoundParameters';
import { parseTheme, gradientUint32ByRgb } from './Color';
import { Size2D } from './Layout';

export type SpectrogramColors = {
	gradient: Uint32Array;
	activePrimary: number;
};
export const createSpectrogramColors = (theme: Theme): SpectrogramColors => {
	const colors = parseTheme('uint32', theme);
	const { background, activeContent } = parseTheme('rgb', theme);
	const gradient = gradientUint32ByRgb(background, activeContent, 256);
	return { gradient, activePrimary: colors.activePrimary };
};

export type DrawSpectrogramOptions = {
	input: RealArray<'uint8'>[];
	output: Uint8ClampedArray;
	frame: Size2D;
	colors: SpectrogramColors;
	soundParameters: SoundParameters;
	cursor?: number;
};
export const drawSpectrogram = (options: DrawSpectrogramOptions): void => {
	const { input, output, frame, colors, soundParameters, cursor } = options;
	const { frequencyRange, sampleRate } = soundParameters;
	const { gradient, activePrimary } = colors;
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

	if (typeof cursor === 'number') {
		const y = Math.round(cursor * (frame.height - 1));
		index = y * frame.width;
		out.fill(activePrimary, index, index + frame.width);
	}
};
