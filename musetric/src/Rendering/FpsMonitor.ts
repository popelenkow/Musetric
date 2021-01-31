import { rgbToHex, Layout2D } from '..';

export type FpsMonitor = {
	getDelta: () => number;
	getFps: () => number;
	setDelta: (delta: number) => void;
	draw: (context: CanvasRenderingContext2D, layout: Layout2D) => void;
};

export const createFpsMonitor = (): FpsMonitor => {
	let delta = 0;
	const getDelta = () => delta;
	const getFps = () => 1000 / delta;
	const setDelta: FpsMonitor['setDelta'] = (curDelta) => {
		delta = delta * 0.95 + curDelta * 0.05;
	};
	const draw: FpsMonitor['draw'] = (context, layout) => {
		const { position, view, colors } = layout;

		const value = Math.round(getFps());
		const text = value.toString();

		context.textBaseline = 'top';
		context.font = `Bold ${view.height}px serif`;
		context.fillStyle = rgbToHex(colors.content);
		context.fillText(text, position.x, position.y, view.width);
		context.strokeStyle = rgbToHex(colors.background);
		context.strokeText(text, position.x, position.y, view.width);
	};
	const result: FpsMonitor = {
		getDelta,
		getFps,
		setDelta,
		draw,
	};
	return result;
};
