import { Core } from '..';

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

export const getColors = (appElement: HTMLElement): Colors | undefined => {
	const background = Core.getColor(appElement, '--color__contentBg');
	const content = Core.getColor(appElement, '--color__content');
	if (!background) return undefined;
	if (!content) return undefined;
	const colors: Colors = {
		background,
		content,
	};
	return colors;
};
