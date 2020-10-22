/* eslint-disable no-param-reassign */

/**
 * Converts an HSL color value to RGB. Conversion formula
 * adapted from http://en.wikipedia.org/wiki/HSL_color_space.
 * Assumes h, s, and l are contained in the set [0, 1] and
 * returns r, g, and b in the set [0, 255].
 */
const hslToRgb = (h: number, s: number, l: number) => {
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

	return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
};

export const getColor = (app: HTMLElement, cssName: string) => {
	if (!app) return undefined;
	const value = getComputedStyle(app).getPropertyValue(cssName);
	const regex = /hsl\((\d+),\s*([\d.]+)%,\s*([\d.]+)%\)/;
	const hsl = regex.exec(value)?.slice(1)?.map(x => Number(x));
	if (!hsl) return undefined;
	const res = hslToRgb(hsl[0], hsl[1] / 100, hsl[2] / 100);
	return res.map(x => x / 255);
};
