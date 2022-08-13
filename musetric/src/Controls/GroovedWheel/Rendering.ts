import { Size2D } from '../../Rendering/Layout';

export type GroovedWheelColors = {
	content: number,
	background: number,
};
export const drawGroovedWheel = (
	position: number,
	output: Uint8ClampedArray,
	frame: Size2D,
	colors: GroovedWheelColors,
): void => {
	const { content, background } = colors;
	const out = new Uint32Array(output.buffer);
	const round = (value: number, period: number): number => {
		return ((Math.floor(value) % period) + period) % period;
	};
	for (let y = 0; y < frame.height; y++) {
		const indexY = y * frame.width;
		for (let x = 0; x < frame.width; x++) {
			const index = indexY + x;
			const width = 26;
			const half = width / 2;
			const range = 5;
			const hr = range / 2;
			const fixedX = round(x + position, width);
			const color = (fixedX > half - hr && fixedX < half + hr) ? content : background;
			out[index] = color;
		}
	}
};
