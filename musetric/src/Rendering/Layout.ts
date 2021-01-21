import { Core, Themes } from '..';

export type Position = {
	x: number;
	y: number;
};

export type Size = {
	width: number;
	height: number;
};

export type Colors = {
	background: Core.Color;
	content: Core.Color;
};

export type Layout = {
	position: Position;
	view: Size;
	frame: Size;
	colors: Colors;
};

export const parseHslColors = (theme: Themes.Theme): Colors | undefined => {
	const background = Core.parseHsl(theme.contentBg);
	const content = Core.parseHsl(theme.content);
	if (!background) return undefined;
	if (!content) return undefined;
	const colors: Colors = {
		background,
		content,
	};
	return colors;
};
