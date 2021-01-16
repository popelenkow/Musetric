/* eslint-disable no-param-reassign */
import { Layout } from '.';

export const drawFrequency = (
	inputData: Uint8Array,
	outputData: Uint8ClampedArray,
	layout: Layout,
): void => {
	const { position, view, frame, colors } = layout;

	const step = (1.0 * inputData.length) / view.width;
	const count = Math.max(Math.floor(step), 1);

	for (let x = 0; x < view.width; x++) {
		const offset = Math.floor(x * step);
		let magnitude = 0;
		for (let i = 0; i < count; i++) {
			magnitude += inputData[offset + i];
		}
		magnitude *= 1.0;
		magnitude /= count;
		magnitude /= 255;

		for (let y = 0; y < view.height; y++) {
			const yIndex = 4 * (position.y + y) * frame.width;
			const index = 4 * (position.x + x) + yIndex;
			const isDraw = (magnitude * view.height) > view.height - y - 1;
			const color = isDraw ? colors.content : colors.background;
			outputData[index + 0] = color.r * 255;
			outputData[index + 1] = color.g * 255;
			outputData[index + 2] = color.b * 255;
			outputData[index + 3] = 255;
		}
	}
};
