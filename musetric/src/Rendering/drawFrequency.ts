/* eslint-disable no-param-reassign */
import { Layout } from '.';

export const drawFrequency = (
	audioData: Uint8Array,
	viewData: Uint8ClampedArray,
	layout: Layout,
): void => {
	const { frame, colors } = layout;

	const count = Math.floor(audioData.length / frame.width);
	for (let x = 0; x < frame.width; x++) {
		const offset = x * count;
		let magnitude = 0;
		for (let i = 0; i < count; i++) {
			magnitude += audioData[offset + i];
		}
		magnitude /= count;
		magnitude *= 1.0;
		magnitude /= 255;
		for (let y = 0; y < frame.height; y++) {
			const point = (x + (y * frame.width)) * 4;
			const isDraw = (magnitude * frame.height) > frame.height - y - 1;
			const color = isDraw ? colors.content : colors.background;
			viewData[point + 0] = color.r * 255;
			viewData[point + 1] = color.g * 255;
			viewData[point + 2] = color.b * 255;
			viewData[point + 3] = 255;
		}
	}
};
