/* eslint-disable no-param-reassign */
export type Color = {
	r: number;
	g: number;
	b: number;
};

export const hslToRgb = (h: number, s: number, l: number): Color => {
	let r;
	let g;
	let b;

	if (s === 0) {
		r = l;
		g = l;
		b = l;
	} else {
		const hue2rgb = (p: number, q: number, t: number) => {
			if (t < 0) t += 1;
			if (t > 1) t -= 1;
			if (t < 1 / 6) return p + (q - p) * 6 * t;
			if (t < 1 / 2) return q;
			if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
			return p;
		};

		const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
		const p = 2 * l - q;
		r = hue2rgb(p, q, h + 1 / 3);
		g = hue2rgb(p, q, h);
		b = hue2rgb(p, q, h - 1 / 3);
	}

	return { r, g, b };
};

const componentToHex = (c: number): string => {
	const hex = c.toString(16);
	return hex.length === 1 ? `0${hex}` : hex;
};

export const rgbToHex = (color: Color): string => {
	const { r, g, b } = color;
	const arr = [r, g, b];
	const result = arr.map(x => componentToHex(Math.round(x * 255))).reduce((acc, x) => acc + x, '#');
	return result;
};

export const getColor = (appElement: HTMLElement, cssName: string): Color | undefined => {
	if (!appElement) return undefined;
	const value = getComputedStyle(appElement).getPropertyValue(cssName);
	const regex = /hsl\((\d+),\s*([\d.]+)%,\s*([\d.]+)%\)/;
	const hsl = regex.exec(value)?.slice(1)?.map(x => Number(x));
	if (!hsl) return undefined;
	const result = hslToRgb(hsl[0], hsl[1] / 100, hsl[2] / 100);
	return result;
};
