import { Theme } from '../AppBase/Theme';
import { RealArray } from '../TypedArray/RealArray';
import { parseTheme } from './Color';
import { Size2D } from './Layout';

export type FrequencyColors = {
	activeContent: number,
	background: number,
};
export const createFrequencyColors = (theme: Theme): FrequencyColors => {
	const { activeContent, background } = parseTheme('uint32', theme);
	return { activeContent, background };
};

export const drawFrequency = (
	input: RealArray,
	output: Uint8ClampedArray,
	frame: Size2D,
	colors: FrequencyColors,
): void => {
	const { activeContent, background } = colors;
	const out = new Uint32Array(output.buffer);

	const step = (1.0 * input.real.length) / frame.height;

	for (let y = 0; y < frame.height; y++) {
		const offset = Math.floor(y * step);
		const magnitude = input.real[offset];
		const index = y * frame.width;
		const limit = Math.ceil(magnitude * frame.width);

		out.fill(activeContent, index, index + limit);
		out.fill(background, index + limit, index + frame.width);
	}
};
