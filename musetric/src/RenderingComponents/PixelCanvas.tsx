import { useMemo } from 'react';
import { Size2D } from '../Rendering/Layout';

export type UsePixelCanvasProps = {
	size: Size2D;
};
export type PixelCanvas = {
	canvas: HTMLCanvasElement;
	context: CanvasRenderingContext2D;
	image: ImageData;
	size: Size2D;
};
export const usePixelCanvas = (props: UsePixelCanvasProps): PixelCanvas => {
	const { size } = props;
	const info = useMemo(() => {
		const canvas = document.createElement('canvas');
		const context = canvas.getContext('2d');
		if (!context) throw new Error();
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
