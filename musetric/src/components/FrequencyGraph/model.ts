/* eslint-disable no-mixed-operators */
import { Color } from 'three';

export type FrequencyInfo = {
	viewData: Uint8Array;
	recorderData: Uint8Array;
	width: number;
	height: number;
	backgroundColor: Color;
	contentColor: Color;
}
export const drawFrequency = (info: FrequencyInfo) => {
	const { viewData, recorderData, width, height, backgroundColor, contentColor } = info;

	const count = Math.floor(recorderData.length / width);
	for (let x = 0; x < width; x++) {
		const offset = x * count;
		let magnitude = 0;
		for (let i = 0; i < count; i++) {
			magnitude += recorderData[offset + i];
		}
		magnitude /= count;
		for (let y = 0; y < height; y++) {
			const point = (x + (y * width)) * 3;
			const isDraw = (1.0 * magnitude / 255 * height) > y;
			const color = isDraw ? contentColor : backgroundColor;
			viewData[point + 0] = color.r * 255;
			viewData[point + 1] = color.g * 255;
			viewData[point + 2] = color.b * 255;
		}
	}
};
