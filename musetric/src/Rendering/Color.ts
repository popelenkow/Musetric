import Color from 'color';
import { Theme } from '../AppBase/Theme';
import type { ValueObject } from '../UtilityTypes';

export type Rgb = {
	r: number,
	g: number,
	b: number,
};

export const parseColorToRgb = (color: Color): Rgb => {
	return { r: color.red(), g: color.green(), b: color.blue() };
};
export const parseColorToUint32Color = (color: Color): number => {
	const buffer = new ArrayBuffer(4);
	const rgba = new Uint8Array(buffer);
	const result = new Uint32Array(buffer);
	rgba[0] = color.red();
	rgba[1] = color.green();
	rgba[2] = color.blue();
	rgba[3] = 255;
	return result[0];
};
type ColorTypeMap = {
	color: Color<string>,
	rgb: Rgb,
	uint32: number,
	hex: string,
};
export type ColorType = keyof ColorTypeMap;
export type TypedTheme<Type extends ColorType> = ValueObject<Theme, ColorTypeMap[Type]>;

export const colorMap = {
	color: (value: Color): ColorTypeMap['color'] => value,
	rgb: (value: Color): ColorTypeMap['rgb'] => parseColorToRgb(value),
	uint32: (value: Color): ColorTypeMap['uint32'] => parseColorToUint32Color(value),
	hex: (value: Color): ColorTypeMap['hex'] => value.hex(),
};
export const parseColor = <Type extends ColorType>(
	type: Type,
	colorString: string,
): ColorTypeMap[Type] => {
	const color = new Color(colorString);
	const map = colorMap[type];
	// eslint-disable-next-line @typescript-eslint/consistent-type-assertions
	return map(color) as ColorTypeMap[Type];
};
export const parseTheme = <Type extends ColorType>(
	type: Type,
	theme: Theme,
): TypedTheme<Type> => {
	// eslint-disable-next-line @typescript-eslint/consistent-type-assertions
	const result = {} as TypedTheme<Type>;
	// eslint-disable-next-line @typescript-eslint/consistent-type-assertions
	const keys = Object.keys(theme) as (keyof Theme)[];
	keys.forEach((key) => {
		result[key] = parseColor(type, theme[key]);
	});
	return result;
};

export const gradientUint32ByRgb = (
	from: Rgb,
	to: Rgb,
	count: number,
	map: (value: number) => number = (value): number => value,
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
	return gradientUint32ByRgb(parseColorToRgb(from), parseColorToRgb(to), count);
};
