import { Theme } from '../AppBase/Theme';
import { parseThemeUint32Color } from './Color';
import { Size2D } from './Layout';

export type FrequencyColors = {
	content: number;
	background: number;
};
export const createFrequencyColors = (theme: Theme): FrequencyColors => {
	const { content, background } = parseThemeUint32Color(theme);
	return { content, background };
};

export const drawFrequency = (
	input: Float32Array,
	output: Uint8ClampedArray,
	frame: Size2D,
	colors: FrequencyColors,
): void => {
	const { content, background } = colors;
	const out = new Uint32Array(output.buffer);

	const step = (1.0 * input.length) / frame.height;

	for (let y = 0; y < frame.height; y++) {
		const offset = Math.floor(y * step);
		const magnitude = input[offset];
		const index = y * frame.width;
		const limit = Math.ceil(magnitude * frame.width);

		out.fill(content, index, index + limit);
		out.fill(background, index + limit, index + frame.width);
	}
};
