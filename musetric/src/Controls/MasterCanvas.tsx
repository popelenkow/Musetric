import React, { useState, useMemo, useCallback } from 'react';
import {
	AppCss, createUseClasses, rotatePosition2D,
	Size2D, Layout2D, Position2D, getCanvasCursorPosition2D,
	drawImage, useAnimation,
} from '..';

export const getMasterCanvasClasses = (css: AppCss) => ({
	root: {
		display: 'block',
		background: css.theme.app,
		width: '100%',
		height: '100%',
	},
});

export const useMasterCanvasClasses = createUseClasses('MasterCanvas', getMasterCanvasClasses);

const useScreen = (
	size: Size2D,
	onClick: (e: React.MouseEvent<HTMLCanvasElement>) => void,
) => {
	const classes = useMasterCanvasClasses();
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

export type MasterCanvasItem = {
	image: CanvasImageSource;
	layout: Layout2D;
	onClick?: (cursorPosition: Position2D) => void;
};

export type MasterCanvasProps = {
	items: MasterCanvasItem[];
	size: Size2D;
};

export const MasterCanvas: React.FC<MasterCanvasProps> = (props) => {
	const { items, size } = props;

	const click = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
		const item = items.filter(x => x.onClick)[0];
		if (!item.onClick) return;
		const position = getCanvasCursorPosition2D(e.currentTarget, e.nativeEvent);
		const result = rotatePosition2D(position, item.layout.direction);
		item.onClick(result);
	}, [items]);

	const screen = useScreen(size, click);

	useAnimation(() => {
		if (!screen.context) return;
		for (let i = 0; i < items.length; i++) {
			const item = items[i];
			drawImage(screen.context, item.image, item.layout);
		}
	}, [screen, items]);

	return screen.element;
};
