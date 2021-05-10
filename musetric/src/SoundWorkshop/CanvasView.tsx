import React, { useState, useMemo } from 'react';
import {
	Theme, createUseClasses, useThemeContext, ColorTheme,
	Size2D, Layout2D,
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

export type CanvasViewProps = {
	draw: (output: Uint8ClampedArray, layout: Layout2D, colorTheme: ColorTheme) => void;
	size: Size2D;
	onClick?: (e: React.MouseEvent<HTMLCanvasElement>) => void;
	performanceMonitor?: PerformanceMonitorRef | null;
};

export const CanvasView: React.FC<CanvasViewProps> = (props) => {
	const { draw, size, onClick, performanceMonitor } = props;
	const classes = useCanvasViewClasses();
	const { theme } = useThemeContext();

	const [canvas, setCanvas] = useState<HTMLCanvasElement | null>(null);

	const info = useMemo(() => {
		if (!canvas) return undefined;
		canvas.width = size.width;
		canvas.height = size.height;
		const context = canvas.getContext('2d');
		if (!context) return undefined;
		const image = context.getImageData(0, 0, size.width, size.height);
		const layout: Layout2D = {
			position: { x: 0, y: 0 },
			view: size,
			frame: size,
		};
		return { context, image, layout };
	}, [canvas, size]);

	useAnimation(() => {
		if (!info) return;
		performanceMonitor?.begin();

		const { context, image, layout } = info;
		draw(image.data, layout, theme.color);
		context.putImageData(image, 0, 0);

		performanceMonitor?.end();
	}, [draw, performanceMonitor, theme, info]);

	return <canvas className={classes.root} ref={setCanvas} {...size} onClick={onClick} />;
};
