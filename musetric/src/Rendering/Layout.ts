import Color from 'color';
import { ColorTheme } from '..';

export type Direction = 'down' | 'up' | 'left' | 'right';

export type Position2D = {
	x: number;
	y: number;
};

export type Size2D = {
	width: number;
	height: number;
};

export type Rgb = {
	r: number,
	g: number,
	b: number,
};

export type Layout2D = {
	frame: Size2D;
	view?: Size2D;
	position?: Position2D;
	direction?: Direction;
};

export const parseRgbColor = (color: Color): Rgb => {
	return { r: color.red(), g: color.green(), b: color.blue() };
};

export const parseThemeRgbColor = (theme: ColorTheme) => {
	const background = parseRgbColor(new Color(theme.app));
	const content = parseRgbColor(new Color(theme.content));
	const active = parseRgbColor(new Color(theme.active));
	const colors = {
		background,
		content,
		active,
	};
	return colors;
};

export const parseUint32Color = (color: Color) => {
	const buffer = new ArrayBuffer(4);
	const rgba = new Uint8Array(buffer);
	const result = new Uint32Array(buffer);
	rgba[0] = color.red();
	rgba[1] = color.green();
	rgba[2] = color.blue();
	rgba[3] = 255;
	return result[0];
};

export const parseThemeUint32Color = (theme: ColorTheme) => {
	const background = parseUint32Color(new Color(theme.app));
	const content = parseUint32Color(new Color(theme.content));
	const active = parseUint32Color(new Color(theme.active));
	const colors = {
		background,
		content,
		active,
	};
	return colors;
};

export const parseThemeHexColor = (theme: ColorTheme) => {
	const background = new Color(theme.app).hex();
	const content = new Color(theme.content).hex();
	const active = new Color(theme.active).hex();
	const colors = {
		background,
		content,
		active,
	};
	return colors;
};

export const getCanvasCursorPosition2D = (
	canvas: HTMLCanvasElement,
	event: MouseEvent,
): Position2D => {
	const rect = canvas.getBoundingClientRect();
	const x = (event.clientX - rect.left) / (rect.width - 1);
	const y = (event.clientY - rect.top) / (rect.height - 1);
	return { x, y };
};

export const rotatePosition2D = (
	position: Position2D,
	direction?: Direction,
): Position2D => {
	if (!direction || direction === 'down') return position;
	if (direction === 'up') return { x: position.x, y: 1 - position.y };
	if (direction === 'left') return { x: 1 - position.y, y: position.x };
	if (direction === 'right') return { x: position.y, y: 1 - position.x };
	return position;
};

export const rotateSize2D = (
	size: Size2D,
	direction?: Direction,
): Size2D => {
	if (!direction || direction === 'down' || direction === 'up') return size;
	if (direction === 'left' || direction === 'right') return { width: size.height, height: size.width };
	return size;
};

export const drawImage = (
	context: CanvasRenderingContext2D,
	image: HTMLCanvasElement,
	layout: Layout2D,
) => {
	const { frame, direction } = layout;
	context.save();
	if (direction === 'up') {
		context.transform(1, 0, 0, -1, 0, frame.height);
	} else if (direction === 'right') {
		context.translate(frame.width, 0);
		context.rotate(Math.PI / 2);
	} else if (direction === 'left') {
		context.translate(0, frame.height);
		context.rotate(-Math.PI / 2);
	}
	context.drawImage(image, 0, 0);
	context.restore();
};
