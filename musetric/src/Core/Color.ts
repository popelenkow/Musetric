export type Rgb = {
	/** range 0 to 255 */
	r: number;
	/** range 0 to 255 */
	g: number;
	/** range 0 to 255 */
	b: number;
};

const componentToHex = (c: number): string => {
	const hex = c.toString(16);
	return hex.length === 1 ? `0${hex}` : hex;
};

export const rgbToHex = (color: Rgb): string => {
	const { r, g, b } = color;
	const arr = [r, g, b];
	const result = arr.map(componentToHex).reduce((acc, x) => acc + x, '#');
	return result;
};

export const parseRgb = (value: string): Rgb | undefined => {
	const regex = /^rgb\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)$/;
	const rgb = regex.exec(value)?.slice(1)?.map(x => Number(x));
	if (!rgb) return undefined;
	const result: Rgb = { r: rgb[0], g: rgb[1], b: rgb[2] };
	return result;
};
