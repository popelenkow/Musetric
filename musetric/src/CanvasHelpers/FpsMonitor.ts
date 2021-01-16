import { Color, rgbToHex } from '.';

export type FpsMonitor = {
	getDelta: () => number;
	getFps: () => number;
	setDelta: (delta: number) => void;
	draw: (ctx: CanvasRenderingContext2D, backgroundColor: Color, contentColor: Color) => void;
};

export const createFpsMonitor = (): FpsMonitor => {
	let delta = 0;
	const getDelta = () => delta;
	const getFps = () => 1000 / delta;
	const setDelta = (curDelta: number) => {
		delta = delta * 0.95 + curDelta * 0.05;
	};
	const draw = (ctx: CanvasRenderingContext2D, backgroundColor: Color, contentColor: Color) => {
		const value = Math.round(getFps());
		const text = value.toString();

		ctx.font = 'Bold 100px Arial';
		ctx.fillStyle = rgbToHex(contentColor);
		ctx.fillText(text, 0, 100);
		ctx.strokeStyle = rgbToHex(backgroundColor);
		ctx.strokeText(text, 0, 100);
	};
	const result: FpsMonitor = {
		getDelta,
		getFps,
		setDelta,
		draw,
	};
	return result;
};
