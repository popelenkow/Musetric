import React, { useMemo, useCallback, FC, useEffect, useState } from 'react';
import { useAnimation } from '../Hooks/Animation';
import { Canvas, CanvasProps, CanvasState } from './Canvas';
import { rotatePosition2D, Size2D, Layout2D, Position2D, getCanvasCursorPosition2D, drawImage, rotateSize2D } from '../Rendering/Layout';
import { createPixelCanvasElement } from '../Rendering/PixelCanvasElement';

export type PixelCanvasProps = {
	layout: Layout2D;
	onClick?: (cursorPosition: Position2D) => void;
	draw: (output: ImageData) => void;
	canvasSize?: Size2D;
};
export const PixelCanvas: FC<PixelCanvasProps> = (props) => {
	const { layout, onClick, draw, canvasSize } = props;

	const pixelCanvasElement = useMemo(() => {
		return createPixelCanvasElement({ size: layout.size });
	}, [layout]);

	const size = useMemo(() => {
		return canvasSize || rotateSize2D(layout.size, layout.direction);
	}, [layout, canvasSize]);

	const [state, setState] = useState<CanvasState>();
	const click = useCallback((event: MouseEvent) => {
		if (!onClick) return;
		if (!state) return;
		const position = getCanvasCursorPosition2D(state.element, event);
		const result = rotatePosition2D(position, layout.direction);
		onClick(result);
	}, [state, layout, onClick]);
	useEffect(() => {
		if (!state) return undefined;
		state.element.addEventListener('click', click);
		return () => {
			state.element?.removeEventListener('click', click);
		};
	}, [state, click]);

	useAnimation(() => {
		if (!pixelCanvasElement) return;
		if (!state) return;
		draw(pixelCanvasElement.imageData);
		pixelCanvasElement.context.putImageData(pixelCanvasElement.imageData, 0, 0);
		drawImage(state.context, pixelCanvasElement.element, layout);
	}, [draw, pixelCanvasElement, state, layout]);

	const canvasProps: CanvasProps = {
		size,
		setState,
	};
	return <Canvas {...canvasProps} />;
};
