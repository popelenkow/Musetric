import React, { useState, useMemo } from 'react';
import {
	Theme, createUseClasses, useThemeContext, ColorTheme,
	Size2D, Layout2D, Position2D, getCanvasCursorPosition2D,
	rotatePosition2D, rotateSize2D, drawImage, Direction2D,
	useAnimation, PerformanceMonitorRef,
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

const useInCanvas = (
	size: Size2D,
	direction?: Direction2D,
) => {
	const inCanvas = useMemo(() => document.createElement('canvas'), []);

	const inInfo = useMemo(() => {
		const canvasSize = rotateSize2D(size, direction);
		inCanvas.width = canvasSize.width;
		inCanvas.height = canvasSize.height;
		const context = inCanvas.getContext('2d');
		if (!context) return undefined;
		context.globalCompositeOperation = 'copy';
		const image = context.getImageData(0, 0, canvasSize.width, canvasSize.height);
		const layout: Layout2D = {
			frame: size,
			direction,
		};
		const inFrame = canvasSize;
		return { context, image, layout, inFrame };
	}, [inCanvas, size, direction]);

	return inInfo;
};

type InCanvasInfo = ReturnType<typeof useInCanvas>;

export type PixelCanvasProps = {
	draw: (output: Uint8ClampedArray, frame: Size2D, colorTheme: ColorTheme) => void;
	size: Size2D;
	direction?: Direction2D;
	onClick?: (cursorPosition: Position2D) => void;
	performanceMonitor?: PerformanceMonitorRef | null;
};

const useOutCanvas = (
	inInfo: InCanvasInfo,
	props: PixelCanvasProps,
) => {
	const { draw, size, direction, onClick, performanceMonitor } = props;
	const classes = useCanvasViewClasses();
	const { theme } = useThemeContext();

	const [canvas, setCanvas] = useState<HTMLCanvasElement | null>(null);

	const outContext = useMemo(() => {
		if (!canvas) return undefined;
		canvas.width = size.width;
		canvas.height = size.height;
		const context = canvas.getContext('2d');
		if (!context) return undefined;
		context.globalCompositeOperation = 'copy';
		return context;
	}, [canvas, size]);

	useAnimation(() => {
		if (!inInfo) return;
		if (!outContext) return;
		performanceMonitor?.begin();

		const { image, layout, inFrame } = inInfo;
		draw(image.data, inFrame, theme.color);
		inInfo.context.putImageData(image, 0, 0);
		const inCanvas = inInfo.context.canvas;
		drawImage(outContext, inCanvas, layout);

		performanceMonitor?.end();
	}, [draw, performanceMonitor, theme, inInfo, outContext]);

	const click = useMemo(() => {
		if (!onClick) return undefined;
		return (e: React.MouseEvent<HTMLCanvasElement>) => {
			const position = getCanvasCursorPosition2D(e.currentTarget, e.nativeEvent);
			const result = rotatePosition2D(position, direction);
			onClick(result);
		};
	}, [onClick, direction]);

	return <canvas className={classes.root} ref={setCanvas} {...size} onClick={click} />;
};

export const PixelCanvas: React.FC<PixelCanvasProps> = (props) => {
	const { size, direction } = props;

	const inInfo = useInCanvas(size, direction);
	const canvas = useOutCanvas(inInfo, props);

	return canvas;
};
