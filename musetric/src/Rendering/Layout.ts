import Color from 'color';
import { ColorTheme } from '..';

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
	position: Position2D;
	view: Size2D;
	frame: Size2D;
	colorTheme: ColorTheme;
};

export const getRgb = (color: Color): Rgb => {
	return { r: color.red(), g: color.green(), b: color.blue() };
};

export const parseColorThemeRgb = (theme: ColorTheme) => {
	const background = getRgb(new Color(theme.app));
	const content = getRgb(new Color(theme.content));
	const colors = {
		background,
		content,
	};
	return colors;
};

export const parseColorThemeHex = (theme: ColorTheme) => {
	const background = new Color(theme.app).hex();
	const content = new Color(theme.content).hex();
	const colors = {
		background,
		content,
	};
	return colors;
};

// eslint-disable-next-line max-len
export const getCanvasCursorPosition = (canvas: HTMLCanvasElement, event: MouseEvent): Position2D => {
	const rect = canvas.getBoundingClientRect();
	const x = (event.clientX - rect.left) / (rect.width - 1);
	const y = (event.clientY - rect.top) / (rect.height - 1);
	return { x, y };
};
