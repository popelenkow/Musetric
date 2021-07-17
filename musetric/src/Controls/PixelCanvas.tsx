import { useMemo } from 'react';
import {
	AppCss, createUseClasses, Theme,
	Size2D, Position2D, Direction2D, PerformanceMonitorRef,
} from '..';

export const getPixelCanvasClasses = (css: AppCss) => ({
	root: {
		display: 'block',
		background: css.theme.app,
		width: '100%',
		height: '100%',
	},
});

export const usePixelCanvasClasses = createUseClasses('PixelCanvas', getPixelCanvasClasses);

export type UsePixelCanvasProps = {
	size: Size2D;
};

export const usePixelCanvas = (props: UsePixelCanvasProps) => {
	const { size } = props;
	const info = useMemo(() => {
		const canvas = new OffscreenCanvas(1, 1);
		const context = canvas.getContext('2d');
		if (!context) throw new Error('OffscreenCanvas.getContext("2d") -> null');
		context.globalCompositeOperation = 'copy';
		return { canvas, context };
	}, []);

	const result = useMemo(() => {
		const { canvas, context } = info;
		canvas.width = size.width;
		canvas.height = size.height;
		const image = context.getImageData(0, 0, size.width, size.height);
		return { canvas, context, image, size };
	}, [info, size]);

	return result;
};

export type PixelCanvasProps = {
	draw: (output: Uint8ClampedArray, frame: Size2D, theme: Theme) => void;
	size: Size2D;
	direction?: Direction2D;
	onClick?: (cursorPosition: Position2D) => void;
	performanceMonitor?: PerformanceMonitorRef | null;
};
