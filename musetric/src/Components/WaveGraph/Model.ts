import { CanvasHelpers } from '../..';

export type WaveInfo = {
	audioData: Float32Array;
	viewData: Uint8ClampedArray;
	width: number;
	height: number;
	backgroundColor: CanvasHelpers.Color;
	contentColor: CanvasHelpers.Color;
};

export const drawWave = (info: WaveInfo): void => {
	const { audioData, viewData, width, height, backgroundColor, contentColor } = info;

	const step = audioData.length / width;
	const amp = height / 2;
	for (let x = 0; x < width; x++) {
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
		for (let y = 0; y < height; y++) {
			const point = (x + (y * width)) * 4;
			const isDraw = ((1 + min) * amp <= y) && ((1 + max) * amp >= y);
			const color = isDraw ? contentColor : backgroundColor;
			viewData[point + 0] = color.r * 255;
			viewData[point + 1] = color.g * 255;
			viewData[point + 2] = color.b * 255;
			viewData[point + 3] = 255;
		}
	}
};
