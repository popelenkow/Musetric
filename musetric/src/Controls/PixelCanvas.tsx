import React, { useMemo, useEffect, useState } from 'react';
import { useAnimation } from '../UtilsReact/Animation';
import { rotatePosition2D, Size2D, Layout2D, Position2D, getCanvasCursorPosition2D, drawImage, rotateSize2D } from '../Rendering/Layout';
import { createPixelCanvasElement } from '../Rendering/PixelCanvasElement';
import { SFC } from '../UtilityTypes/React';
import { Canvas, CanvasProps, CanvasState } from './Canvas';

export type PixelCanvasProps = {
	layout: Layout2D,
	onClick?: (cursorPosition: Position2D) => void,
	draw?: (output: ImageData) => void,
	canvasSize?: Size2D,
};
export const PixelCanvas: SFC<PixelCanvasProps> = (props) => {
	const { layout, onClick, draw, canvasSize } = props;

	const pixelCanvasElement = useMemo(() => {
		return createPixelCanvasElement({ size: layout.size });
	}, [layout]);

	const size = useMemo(() => {
		return canvasSize || rotateSize2D(layout.size, layout.direction);
	}, [layout, canvasSize]);

	const [state, setState] = useState<CanvasState>();

	useEffect(() => {
		if (!state) return undefined;
		if (!onClick) return undefined;

		const click = (event: MouseEvent): void => {
			const position = getCanvasCursorPosition2D(state.element, event);
			const result = rotatePosition2D(position, layout.direction);
			onClick(result);
		};

		state.element.addEventListener('click', click);
		return () => {
			state.element.removeEventListener('click', click);
		};
	}, [state, onClick, layout.direction]);

	useAnimation(() => {
		if (!pixelCanvasElement) return undefined;
		if (!state) return undefined;
		if (!draw) return undefined;
		return () => {
			draw(pixelCanvasElement.imageData);
			pixelCanvasElement.context.putImageData(pixelCanvasElement.imageData, 0, 0);
			drawImage(state.context, pixelCanvasElement.element, layout);
		};
	});

	const canvasProps: CanvasProps = {
		size,
		setState,
	};
	return <Canvas {...canvasProps} />;
};
