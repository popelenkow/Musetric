import React, { useState, useMemo } from 'react';
import {
	Theme, createUseClasses, useThemeContext, ColorTheme,
	Size2D, Layout2D, Position2D, getCanvasCursorPosition2D,
	rotatePosition2D, rotateSize2D, Direction2D,
	drawImage, useAnimation, PerformanceMonitorRef,
} from '..';

export const getCanvasViewClasses = (theme: Theme) => ({
	root: {
		display: 'block',
		background: theme.color.app,
		width: '100%',
		height: '100%',
	},
});

export const useCanvasViewClasses = createUseClasses('CanvasView', getCanvasViewClasses);

const useOffscreen = (
	size: Size2D,
) => {
	const info = useMemo(() => {
		const canvas = new OffscreenCanvas(1, 1);
		const context = canvas.getContext('2d');
		if (!context) return undefined;
		context.globalCompositeOperation = 'copy';
		return { canvas, context };
	}, []);

	const offscreen = useMemo(() => {
		if (!info) return undefined;
		const { canvas, context } = info;
		canvas.width = size.width;
		canvas.height = size.height;
		const image = context.getImageData(0, 0, size.width, size.height);
		return { canvas, context, image, size };
	}, [info, size]);

	return offscreen;
};

const useScreen = (
	size: Size2D,
	onClick?: (e: React.MouseEvent<HTMLCanvasElement>) => void,
) => {
	const classes = useCanvasViewClasses();
	const [canvas, setCanvas] = useState<HTMLCanvasElement | null>(null);

	const context = useMemo(() => {
		if (!canvas) return undefined;
		canvas.width = size.width;
		canvas.height = size.height;
		const ctx = canvas.getContext('2d');
		if (!ctx) return undefined;
		ctx.globalCompositeOperation = 'copy';
		return ctx;
	}, [canvas, size]);

	const element = <canvas className={classes.root} ref={setCanvas} {...size} onClick={onClick} />;

	return { element, context };
};

export type PixelCanvasProps = {
	draw: (output: Uint8ClampedArray, frame: Size2D, colorTheme: ColorTheme) => void;
	size: Size2D;
	direction?: Direction2D;
	onClick?: (cursorPosition: Position2D) => void;
	performanceMonitor?: PerformanceMonitorRef | null;
};

export const PixelCanvas: React.FC<PixelCanvasProps> = (props) => {
	const { draw, size, direction, onClick, performanceMonitor } = props;
	const { theme } = useThemeContext();

	const click = useMemo(() => {
		if (!onClick) return undefined;
		return (e: React.MouseEvent<HTMLCanvasElement>) => {
			const position = getCanvasCursorPosition2D(e.currentTarget, e.nativeEvent);
			const result = rotatePosition2D(position, direction);
			onClick(result);
		};
	}, [onClick, direction]);

	const layout = useMemo<Layout2D>(() => ({ size, direction }), [size, direction]);
	const offscreenSize = useMemo(() => rotateSize2D(size, direction), [size, direction]);
	const offscreen = useOffscreen(offscreenSize);
	const screen = useScreen(size, click);

	useAnimation(() => {
		if (!offscreen) return;
		if (!screen.context) return;
		performanceMonitor?.begin();

		draw(offscreen.image.data, offscreen.size, theme.color);
		offscreen.context.putImageData(offscreen.image, 0, 0);
		drawImage(screen.context, offscreen.canvas, layout);

		performanceMonitor?.end();
	}, [draw, performanceMonitor, theme, offscreen, screen, layout]);

	return screen.element;
};
