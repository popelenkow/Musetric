import { Color } from 'three';

export const getColor = (app: HTMLElement, cssName: string) => {
	if (!app) return undefined;
	const value = getComputedStyle(app).getPropertyValue(cssName);
	const regex = /hsl\((\d+),\s*([\d.]+)%,\s*([\d.]+)%\)/;
	const hsl = regex.exec(value)?.slice(1)?.map(x => Number(x));
	if (!hsl) return undefined;
	const color = new Color().setHSL(hsl[0] / 255, hsl[1] / 100, hsl[2] / 100);
	return color;
};
