import { RealArray } from '../Typed/RealArray';
import { Theme } from '../AppBase/Theme';
import { parseThemeRgbColor, parseThemeUint32Color, gradientUint32ByRgb } from './Color';
import { Size2D } from './Layout';

export type SpectrogramColors = {
	gradient: Uint32Array;
	active: number;
};
export const createSpectrogramColors = (theme: Theme): SpectrogramColors => {
	const { active } = parseThemeUint32Color(theme);
	const { background, content } = parseThemeRgbColor(theme);
	const gradient = gradientUint32ByRgb(background, content, 256);
	return { gradient, active };
};

export const drawSpectrogram = (
	input: RealArray<'uint8'>[],
	output: Uint8ClampedArray,
	frame: Size2D,
	colors: SpectrogramColors,
	cursor?: number,
): void => {
	const { gradient, active } = colors;
	const out = new Uint32Array(output.buffer);

	const stepY = input.length / frame.height;
	let index = 0;
	let offsetY = 0;
	for (let y = 0; y < frame.height; y++) {
		const spectrum = input[Math.floor(offsetY)].real;
		const stepX = spectrum.length / frame.width;
		let offsetX = 0;
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
		out.fill(active, index, index + frame.width);
	}
};
