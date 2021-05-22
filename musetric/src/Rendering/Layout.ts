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

export const getCanvasCursorPosition = (
	canvas: HTMLCanvasElement, event: MouseEvent,
): Position2D => {
	const rect = canvas.getBoundingClientRect();
	const x = (event.clientX - rect.left) / (rect.width - 1);
	const y = (event.clientY - rect.top) / (rect.height - 1);
	return { x, y };
};
