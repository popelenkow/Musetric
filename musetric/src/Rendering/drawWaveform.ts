/* eslint-disable no-param-reassign */
import { Layout } from '.';

export const drawWaveform = (
	audioData: Float32Array,
	viewData: Uint8ClampedArray,
	layout: Layout,
): void => {
	const { frame, colors } = layout;

	const step = audioData.length / frame.width;
	const amp = frame.height / 2;
	for (let x = 0; x < frame.width; x++) {
		let min = 1.0;
		let max = -1.0;
		const index = Math.ceil(x * step);
		for (let j = 0; j < step; j++) {
			const datum = audioData[index + j];
			if (datum < min) {
				min = datum;
			}
			if (datum > max) {
				max = datum;
			}
		}
		for (let y = 0; y < frame.height; y++) {
			const point = (x + (y * frame.width)) * 4;
			const isDraw = ((1 + min) * amp <= y) && ((1 + max) * amp >= y);
			const color = isDraw ? colors.content : colors.background;
			viewData[point + 0] = color.r * 255;
			viewData[point + 1] = color.g * 255;
			viewData[point + 2] = color.b * 255;
			viewData[point + 3] = 255;
		}
	}
};
