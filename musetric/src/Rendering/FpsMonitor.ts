import { Core } from '..';
import { Layout } from '.';

export type FpsMonitor = {
	getDelta: () => number;
	getFps: () => number;
	setDelta: (delta: number) => void;
	draw: (context: CanvasRenderingContext2D, info: Layout) => void;
};

export const createFpsMonitor = (): FpsMonitor => {
	let delta = 0;
	const getDelta = () => delta;
	const getFps = () => 1000 / delta;
	const setDelta: FpsMonitor['setDelta'] = (curDelta) => {
		delta = delta * 0.95 + curDelta * 0.05;
	};
	const draw: FpsMonitor['draw'] = (context, info) => {
		const { colors } = info;

		const value = Math.round(getFps());
		const text = value.toString();

		context.font = 'Bold 100px Arial';
		context.fillStyle = Core.rgbToHex(colors.content);
		context.fillText(text, 0, 100);
		context.strokeStyle = Core.rgbToHex(colors.background);
		context.strokeText(text, 0, 100);
	};
	const result: FpsMonitor = {
		getDelta,
		getFps,
		setDelta,
		draw,
	};
	return result;
};
