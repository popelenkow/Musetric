import Color from 'color';
import { Theme } from '../AppBase/Theme';

export type Rgb = {
	r: number,
	g: number,
	b: number,
};

export type ThemeColor = {
	background: Color<string>;
	content: Color<string>;
	active: Color<string>;
};
export const parseThemeColor = (theme: Theme): ThemeColor => {
	const background = new Color(theme.app);
	const content = new Color(theme.content);
	const active = new Color(theme.active);
	const colors = {
		background,
		content,
		active,
	};
	return colors;
};

export const parseRgbColor = (color: Color): Rgb => {
	return { r: color.red(), g: color.green(), b: color.blue() };
};

export type ThemeRgbColor = {
	background: Rgb;
	content: Rgb;
	active: Rgb;
};
export const parseThemeRgbColor = (theme: Theme): ThemeRgbColor => {
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

export const parseUint32Color = (color: Color): number => {
	const buffer = new ArrayBuffer(4);
	const rgba = new Uint8Array(buffer);
	const result = new Uint32Array(buffer);
	rgba[0] = color.red();
	rgba[1] = color.green();
	rgba[2] = color.blue();
	rgba[3] = 255;
	return result[0];
};

export const gradientUint32ByRgb = (
	from: Rgb,
	to: Rgb,
	count: number,
	map: (value: number) => number = (value) => value,
): Uint32Array => {
	const buffer = new ArrayBuffer(4 * count);
	const rgba = new Uint8Array(buffer);
	const result = new Uint32Array(buffer);
	let offset = 0;
	for (let i = 0; i < count; i++) {
		const value = map(i / (count - 1));
		rgba[offset] = (to.r * value + from.r * (1 - value));
		rgba[offset + 1] = (to.g * value + from.g * (1 - value));
		rgba[offset + 2] = (to.b * value + from.b * (1 - value));
		rgba[offset + 3] = 255;
		offset += 4;
	}
	return result;
};

export const gradientUint32Color = (from: Color, to: Color, count: number): Uint32Array => {
	return gradientUint32ByRgb(parseRgbColor(from), parseRgbColor(to), count);
};

export type ThemeUint32Color = {
	background: number;
	content: number;
	active: number;
};
export const parseThemeUint32Color = (theme: Theme): ThemeUint32Color => {
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
export type ThemeHexColor = {
	background: string;
	content: string;
	active: string;
};
export const parseThemeHexColor = (theme: Theme): ThemeHexColor => {
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
