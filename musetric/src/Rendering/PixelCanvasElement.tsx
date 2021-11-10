import { Size2D } from './Layout';

export type CreatePixelCanvasElementOptions = {
	size: Size2D;
};
export type PixelCanvasElement = {
	element: HTMLCanvasElement;
	context: CanvasRenderingContext2D;
	imageData: ImageData;
	size: Size2D;
};
export const createPixelCanvasElement = (
	options: CreatePixelCanvasElementOptions,
): PixelCanvasElement | undefined => {
	const { size } = options;

	const element = document.createElement('canvas');
	element.width = size.width;
	element.height = size.height;

	const context = element.getContext('2d');
	if (!context) return undefined;
	context.globalCompositeOperation = 'copy';
	const imageData = context.getImageData(0, 0, size.width, size.height);

	return { element, context, imageData, size };
};
