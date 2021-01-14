import { Color } from 'three';

export const getColor = (appElement: HTMLElement, cssName: string): Color | undefined => {
	if (!appElement) return undefined;
	const value = getComputedStyle(appElement).getPropertyValue(cssName);
	const regex = /hsl\((\d+),\s*([\d.]+)%,\s*([\d.]+)%\)/;
	const hsl = regex.exec(value)?.slice(1)?.map(x => Number(x));
	if (!hsl) return undefined;
	const color = new Color().setHSL(hsl[0] / 255, hsl[1] / 100, hsl[2] / 100);
	return color;
};
