import { CanvasHelpers } from '../..';

export type FrequencyInfo = {
	viewData: Uint8ClampedArray;
	recorderData: Uint8Array;
	width: number;
	height: number;
	backgroundColor: CanvasHelpers.Color;
	contentColor: CanvasHelpers.Color;
};
export const drawFrequency = (info: FrequencyInfo): void => {
	const { viewData, recorderData, width, height, backgroundColor, contentColor } = info;

	const count = Math.floor(recorderData.length / width);
	for (let x = 0; x < width; x++) {
		const offset = x * count;
		let magnitude = 0;
		for (let i = 0; i < count; i++) {
			magnitude += recorderData[offset + i];
		}
		magnitude /= count;
		magnitude *= 1.0;
		magnitude /= 255;
		for (let y = 0; y < height; y++) {
			const point = (x + (y * width)) * 4;
			const isDraw = (magnitude * height) > height - y - 1;
			const color = isDraw ? contentColor : backgroundColor;
			viewData[point + 0] = color.r * 255;
			viewData[point + 1] = color.g * 255;
			viewData[point + 2] = color.b * 255;
			viewData[point + 3] = 255;
		}
	}
};
