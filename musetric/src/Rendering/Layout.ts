import { Rgb, parseRgb, Theme } from '..';

export type Position2D = {
	x: number;
	y: number;
};

export type Size2D = {
	width: number;
	height: number;
};

export type Colors = {
	background: Rgb;
	content: Rgb;
};

export type Layout2D = {
	position: Position2D;
	view: Size2D;
	frame: Size2D;
	colors: Colors;
};

export const parseHslColors = (theme: Theme): Colors | undefined => {
	const background = parseRgb(theme.contentBg);
	const content = parseRgb(theme.content);
	if (!background) return undefined;
	if (!content) return undefined;
	const colors: Colors = {
		background,
		content,
	};
	return colors;
};
