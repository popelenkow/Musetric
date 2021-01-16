/* eslint-disable no-param-reassign */
import { Layout } from '.';

export const drawWaveform = (
	inputData: Float32Array,
	outputData: Uint8ClampedArray,
	layout: Layout,
): void => {
	const { position, view, frame, colors } = layout;

	const step = inputData.length / view.width;
	const amp = view.height / 2;

	for (let x = 0; x < view.width; x++) {
		let min = 1.0;
		let max = -1.0;
		const inputIndex = Math.ceil(x * step);
		for (let i = 0; i < step; i++) {
			const datum = inputData[inputIndex + i];
			if (datum < min) {
				min = datum;
			}
			if (datum > max) {
				max = datum;
			}
		}
		for (let y = 0; y < view.height; y++) {
			const yIndex = 4 * (position.y + y) * frame.width;
			const index = 4 * (position.x + x) + yIndex;
			const minY = (1 + min) * amp;
			const maxY = (1 + max) * amp;
			const isDraw = (minY <= y) && (y <= maxY);
			const color = isDraw ? colors.content : colors.background;
			outputData[index + 0] = color.r * 255;
			outputData[index + 1] = color.g * 255;
			outputData[index + 2] = color.b * 255;
			outputData[index + 3] = 255;
		}
	}
};
